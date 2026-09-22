import os
import re
import math
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.config import settings

class RAGChunk:
    def __init__(self, doc_filename: str, title: str, organization: str, official_reference: str, section: str, content: str):
        self.doc_filename = doc_filename
        self.title = title
        self.organization = organization
        self.official_reference = official_reference
        self.section = section
        self.content = content.strip()
        self.tokens = self._tokenize(f"{title} {section} {content}")

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
        tokens = [t for t in cleaned.split() if len(t) > 2]
        # Common English stop words removal
        stop_words = {
            "the", "and", "for", "that", "this", "with", "from", "are", "was", "were", 
            "have", "has", "had", "which", "will", "can", "should", "would", "about", 
            "into", "more", "also", "been", "their", "such", "than", "when", "some"
        }
        return [t for t in tokens if t not in stop_words]

class RAGService:
    _instance = None

    def __init__(self):
        self.chunks: List[RAGChunk] = []
        self.doc_metadata: Dict[str, Dict[str, Any]] = {}
        self.idf: Dict[str, float] = {}
        self.load_and_index_documents()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = RAGService()
        return cls._instance

    def load_and_index_documents(self):
        docs_dir = Path(settings.DOCUMENTS_DIR).resolve()
        if not docs_dir.exists():
            print(f"[RAGService] Warning: Documents directory not found at {docs_dir}")
            return

        self.chunks = []
        self.doc_metadata = {}

        for file_path in docs_dir.glob("*.md"):
            try:
                content = file_path.read_text(encoding="utf-8")
                self._parse_and_chunk_document(file_path.name, content)
            except Exception as e:
                print(f"[RAGService] Error loading document {file_path.name}: {e}")

        # Compute IDF for BM25/TF-IDF retrieval
        total_docs = len(self.chunks)
        doc_freq: Dict[str, int] = {}
        for chunk in self.chunks:
            unique_tokens = set(chunk.tokens)
            for token in unique_tokens:
                doc_freq[token] = doc_freq.get(token, 0) + 1

        self.idf = {
            token: math.log((total_docs - freq + 0.5) / (freq + 0.5) + 1.0)
            for token, freq in doc_freq.items()
        }
        print(f"[RAGService] Indexed {len(self.chunks)} authoritative knowledge chunks from {len(self.doc_metadata)} documents.")

    def _parse_and_chunk_document(self, filename: str, content: str):
        lines = content.splitlines()
        title = filename.replace(".md", "").replace("_", " ").title()
        organization = "Authoritative Source"
        official_ref = "Official Technical Publications"

        # Extract title and headers from front lines
        for line in lines[:10]:
            if line.startswith("# "):
                title = line.replace("# ", "").strip()
            elif "**Authoritative Source:**" in line:
                organization = line.split("**Authoritative Source:**")[-1].strip()
            elif "**Official Reference:**" in line:
                official_ref = line.split("**Official Reference:**")[-1].strip()

        # Split into sections based on ## or ###
        sections = re.split(r'\n(?=##+ )', content)
        doc_chunks_count = 0

        for sec in sections:
            sec = sec.strip()
            if not sec:
                continue
            first_line = sec.splitlines()[0]
            section_title = first_line.lstrip("#").strip() if first_line.startswith("#") else "Overview"
            
            # Avoid single chunk being empty
            chunk = RAGChunk(
                doc_filename=filename,
                title=title,
                organization=organization,
                official_reference=official_ref,
                section=section_title,
                content=sec
            )
            self.chunks.append(chunk)
            doc_chunks_count += 1

        self.doc_metadata[filename] = {
            "filename": filename,
            "title": title,
            "organization": organization,
            "official_reference": official_ref,
            "topics": self._extract_topics(content),
            "chunk_count": doc_chunks_count
        }

    def _extract_topics(self, content: str) -> List[str]:
        topics = []
        if "heatwave" in content.lower():
            topics.append("Heatwave Criteria & Definitions")
        if "health" in content.lower() or "heatstroke" in content.lower():
            topics.append("Health & Physiological Stress")
        if "urban" in content.lower() or "island" in content.lower():
            topics.append("Urban Heat Island & Albedo")
        if "monsoon" in content.lower() or "climate" in content.lower():
            topics.append("Climate Variability & Projections")
        if "ndma" in content.lower() or "center" in content.lower():
            topics.append("Emergency Protocols & SOPs")
        return topics or ["Climate Science"]

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        query_tokens = RAGChunk._tokenize(query)
        if not query_tokens:
            return []

        scored_chunks = []
        avg_dl = sum(len(c.tokens) for c in self.chunks) / max(len(self.chunks), 1)
        k1 = 1.5
        b = 0.75

        for chunk in self.chunks:
            score = 0.0
            chunk_len = len(chunk.tokens)
            chunk_counts = {}
            for t in chunk.tokens:
                chunk_counts[t] = chunk_counts.get(t, 0) + 1

            for qt in query_tokens:
                if qt in chunk_counts:
                    tf = chunk_counts[qt]
                    idf_weight = self.idf.get(qt, 1.0)
                    # BM25 term score
                    term_score = idf_weight * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (chunk_len / avg_dl))))
                    score += term_score

            if score > 0:
                scored_chunks.append((score, chunk))

        # Sort by score descending
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, chunk in scored_chunks[:top_k]:
            results.append({
                "title": chunk.title,
                "organization": chunk.organization,
                "section": chunk.section,
                "content": chunk.content,
                "score": round(score, 3)
            })

        return results

    def query(self, user_query: str, top_k: int = 3) -> Dict[str, Any]:
        retrieved = self.retrieve(user_query, top_k=top_k)

        if not retrieved:
            # Fallback when query doesn't match specific tokens
            return {
                "query": user_query,
                "answer": "Our knowledge base contains authoritative information from the Pakistan Meteorological Department (PMD), NDMA Pakistan, WHO, NASA, and the IPCC on heatwave criteria, extreme heat physiological effects, urban heat islands, and climate adaptation. Please ask a question relating to temperature risk, heatwaves, or climate safety.",
                "sources": [],
                "mode": "local_extractive",
                "disclaimer": "Answers are derived strictly from authoritative climate resources (PMD, NDMA Pakistan, WHO, NASA, IPCC). This is an educational and scenario intelligence tool, not an official emergency forecast."
            }

        # Check if external LLM key is configured (Gemini or OpenAI)
        if settings.GEMINI_API_KEY:
            try:
                answer = self._call_gemini_llm(user_query, retrieved)
                return {
                    "query": user_query,
                    "answer": answer,
                    "sources": retrieved,
                    "mode": "llm_synthesized",
                    "disclaimer": "Synthesized with authoritative sources using Gemini AI."
                }
            except Exception as e:
                print(f"[RAGService] Gemini synthesis error, falling back to local synthesis: {e}")

        # Local High-Precision Extractive Synthesis
        answer = self._synthesize_local_answer(user_query, retrieved)

        return {
            "query": user_query,
            "answer": answer,
            "sources": retrieved,
            "mode": "local_extractive",
            "disclaimer": "Answers are derived strictly from authoritative climate resources (PMD, NDMA Pakistan, WHO, NASA, IPCC). This is an educational and scenario intelligence tool, not an official emergency forecast."
        }

    def _synthesize_local_answer(self, query: str, retrieved_sources: List[Dict[str, Any]]) -> str:
        """
        Synthesizes a clean, coherent answer strictly from the retrieved authoritative passages.
        """
        paragraphs = []
        for s in retrieved_sources:
            # Remove Markdown headers from snippet for clean reading
            text = re.sub(r'#+\s*', '', s['content'])
            # Extract most informative lines
            lines = [line.strip() for line in text.splitlines() if line.strip() and not line.startswith('**Authoritative') and not line.startswith('**Official')]
            clean_text = "\n".join(lines[:4])
            paragraphs.append(f"**From {s['organization']} ({s['section']}):**\n{clean_text}")

        synthesis_header = "Based on authoritative climate and heat-health guidelines:\n\n"
        return synthesis_header + "\n\n".join(paragraphs)

    def _call_gemini_llm(self, query: str, retrieved_sources: List[Dict[str, Any]]) -> str:
        import httpx
        context_blocks = "\n\n".join([f"Source: {s['organization']} - {s['title']} ({s['section']}):\n{s['content']}" for s in retrieved_sources])
        prompt = (
            f"You are the Pakistan Climate Risk Knowledge Assistant. Answer the user question accurately, strictly citing the provided authoritative sources (PMD, NDMA, WHO, NASA, IPCC). Do not invent citations.\n\n"
            f"Context:\n{context_blocks}\n\n"
            f"User Question: {query}\n\n"
            f"Answer:"
        )
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"].strip()

    def get_indexed_sources(self) -> List[Dict[str, Any]]:
        return list(self.doc_metadata.values())

rag_service = RAGService.get_instance()
