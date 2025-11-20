# 🌲🔥 Forest Fire Risk Prediction

A project to predict wildfire risk using environmental parameters such as temperature, humidity, wind, vegetation dryness, and rainfall.

---

## 🔥 Main Causes of Forest Fires

There are six major natural & human-driven causes of forest fires:

1. **Human Activities**
2. **High Temperature**
3. **Low Humidity**
4. **Strong Winds**
5. **Drought**
6. **Lightning**

These factors increase the likelihood of fire ignition and spread.

---

## 🌦 Environmental Parameters Used

The model considers the following input parameters:

- **Temperature**
- **Humidity**
- **Wind Speed**
- **Dry Vegetation Index**
- **Rainfall / Days Since Rain**

These parameters help determine the dryness of the environment and the probability of ignition.

---

## 📊 Risk Classification Table

This table defines the reference ranges used to identify **Low**, **Medium**, and **High** fire risk levels.

| Factor              | Low Risk | Medium Risk | High Risk |
| ------------------- | -------- | ----------- | --------- |
| **Temperature**     | < 60°F   | 60–85°F     | > 85°F    |
| **Humidity**        | > 60%    | 30–60%      | < 30%     |
| **Wind Speed**      | < 8 mph  | 8–18 mph    | > 18 mph  |
| **Days Since Rain** | 0–5 days | 6–15 days   | > 15 days |

These thresholds can be fine-tuned based on dataset and region.

---
