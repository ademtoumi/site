---
layout: page
title: Malicious URL Detection using Machine Learning
description: ML Project — ESI-SBA, 2024–2025
img:
importance: 3
category: AI & Data Science
---

Comparative study of four classifiers for four-class URL classification on a dataset of **651,191 URLs** (benign, defacement, phishing, malware).

## Approach

- Feature extraction: TF-IDF character n-grams (3–5 gram) combined with 15+ structural URL features (URL length, subdomain depth, special character counts, domain age indicators).
- Models compared: Logistic Regression, Random Forest, XGBoost, LSTM.
- Best result: **Random Forest at 96.8% macro-averaged F1-score**.

## Repository

[Malicious URL Detection on GitHub](https://github.com/ademtoumi/Malicious-URL-Detection)

## Technologies

`Python` `Scikit-learn` `XGBoost` `TensorFlow` `Pandas`
