import streamlit as st
import pandas as pd
import numpy as np
import joblib
from pathlib import Path


# =========================
# PAGE CONFIG
# =========================

st.set_page_config(
    page_title="Pakistan Climate Risk Intelligence",
    page_icon="🌍",
    layout="wide"
)


# =========================
# PATHS
# =========================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "temperature_model.pkl"
INFO_PATH = BASE_DIR / "models" / "model_info.pkl"


# =========================
# LOAD MODEL
# =========================

@st.cache_resource
def load_model():
    return joblib.load(MODEL_PATH)


@st.cache_resource
def load_model_info():
    return joblib.load(INFO_PATH)


model = load_model()
model_info = load_model_info()


# =========================
# HEAT RISK FUNCTION
# =========================

def calculate_heat_risk(temp):
    if temp >= 45:
        return "EXTREME", "Very high temperature risk. Take immediate precautions."
    elif temp >= 40:
        return "HIGH", "High temperature risk. Reduce prolonged outdoor exposure."
    elif temp >= 35:
        return "MODERATE", "Moderate heat risk. Stay hydrated and avoid excessive heat."
    else:
        return "LOW", "Lower temperature-related heat risk."


# =========================
# HEADER
# =========================

st.title("🌍 Pakistan Climate Risk Intelligence")

st.subheader("2026 Heat Risk & Temperature Intelligence")

st.write(
    "An ML-powered climate intelligence dashboard using historical "
    "Pakistan weather data to estimate maximum temperature and "
    "temperature-based heat risk."
)

st.divider()


# =========================
# SIDEBAR
# =========================

st.sidebar.header("Weather Scenario")

cities = model_info["cities"]

city = st.sidebar.selectbox(
    "Select City",
    cities
)

selected_date = st.sidebar.date_input(
    "Select Date",
    value=pd.Timestamp("2026-06-15"),
    min_value=pd.Timestamp("2026-01-01"),
    max_value=pd.Timestamp("2026-12-31")
)

temp_min = st.sidebar.number_input(
    "Minimum Temperature (°C)",
    min_value=-10.0,
    max_value=50.0,
    value=25.0,
    step=0.5
)

rain = st.sidebar.number_input(
    "Rainfall (mm)",
    min_value=0.0,
    max_value=500.0,
    value=0.0,
    step=0.5
)

solar_radiation = st.sidebar.number_input(
    "Solar Radiation",
    min_value=0.0,
    max_value=40.0,
    value=15.0,
    step=0.1
)


# =========================
# DATE FEATURES
# =========================

date = pd.Timestamp(selected_date)

month = date.month
day_of_year = date.dayofyear

month_sin = np.sin(2 * np.pi * month / 12)
month_cos = np.cos(2 * np.pi * month / 12)


# =========================
# PREDICTION
# =========================

input_data = pd.DataFrame(
    {
        "temp_min": [temp_min],
        "rain": [rain],
        "solar_radiation": [solar_radiation],
        "month": [month],
        "day_of_year": [day_of_year],
        "month_sin": [month_sin],
        "month_cos": [month_cos],
        "city": [city],
    }
)

predicted_temp = float(model.predict(input_data)[0])

risk, risk_message = calculate_heat_risk(predicted_temp)


# =========================
# MAIN METRICS
# =========================

col1, col2, col3 = st.columns(3)

with col1:
    st.metric(
        "Predicted Maximum Temperature",
        f"{predicted_temp:.1f} °C"
    )

with col2:
    st.metric(
        "Heat Risk",
        risk
    )

with col3:
    st.metric(
        "Model R²",
        f"{model_info['r2']:.3f}"
    )


st.divider()


# =========================
# RISK MESSAGE
# =========================

st.subheader("🌡️ Climate Risk Assessment")

if risk == "EXTREME":
    st.error(f"**{risk} HEAT RISK** — {risk_message}")

elif risk == "HIGH":
    st.warning(f"**{risk} HEAT RISK** — {risk_message}")

elif risk == "MODERATE":
    st.info(f"**{risk} HEAT RISK** — {risk_message}")

else:
    st.success(f"**{risk} HEAT RISK** — {risk_message}")


# =========================
# INPUT SUMMARY
# =========================

st.subheader("📊 Scenario Details")

scenario = pd.DataFrame(
    {
        "Parameter": [
            "City",
            "Date",
            "Minimum Temperature",
            "Rainfall",
            "Solar Radiation",
        ],
        "Value": [
            city,
            str(selected_date),
            f"{temp_min:.1f} °C",
            f"{rain:.1f} mm",
            f"{solar_radiation:.2f}",
        ],
    }
)

st.dataframe(
    scenario,
    use_container_width=True,
    hide_index=True
)


# =========================
# MODEL INFORMATION
# =========================

with st.expander("ℹ️ About the ML Model"):

    st.write(
        "The temperature prediction model was trained using historical "
        "Pakistan weather observations."
    )

    st.write(
        f"**Training period:** "
        f"{model_info['training_start']} → "
        f"{model_info['training_end']}"
    )

    st.write(
        f"**Mean Absolute Error:** "
        f"{model_info['mae']:.2f} °C"
    )

    st.write(
        f"**R² Score:** "
        f"{model_info['r2']:.4f}"
    )

    st.write(
        "**Cities:** "
        + ", ".join(model_info["cities"])
    )


# =========================
# DISCLAIMER
# =========================

st.divider()

st.caption(
    "Research/portfolio project. Predictions are estimates based on "
    "historical weather patterns and should not be treated as official "
    "weather forecasts or emergency warnings."
)