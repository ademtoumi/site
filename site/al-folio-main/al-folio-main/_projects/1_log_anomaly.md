---
layout: page
title: Log-Based Anomaly Detection in Distributed Systems
description: Engineering PFE & Master's Thesis - ESI-SBA, 2025-2026
img:
importance: 1
category: AI & Data Science
related_publications: true
---

Combined Engineering thesis and Master's thesis at ESI-SBA. The Engineering thesis provides a comprehensive implementation and benchmark of **eleven ML and DL models** — SVM, Random Forest, Decision Tree, Isolation Forest, Attention-BiLSTM, CNN+BiLSTM, DeepLog, LSTM Autoencoder, Dense Autoencoder, LogBERT, and BiLSTM-AE+Word2Vec — across the **HDFS**, **BGL**, and **Spirit** log datasets under a unified experimental protocol with strict temporal train/test splitting. The Master's thesis presents a systematic literature survey and comparative synthesis of log-based anomaly detection methods.

## Key Components

- **Preprocessing:** Drain log parser, BlockId session construction (HDFS), sliding window (BGL/Spirit), temporal split, TF-IDF vectorization with zero-leakage guarantee.
- **Models benchmarked:** 3 classical ML + 5 supervised DL + 3 unsupervised DL, evaluated on F1, Precision, Recall, and AUC-ROC.
- **XAI module:** SHAP (feature attribution) and LIME (local approximation) post-hoc explanations for every model.
- **Real-time pipeline:** Apache Kafka (Aiven) → FastAPI inference on Hugging Face Spaces → PostgreSQL (Aiven) → Streamlit monitoring dashboard.

## Selected Results

| Dataset | Best Model | F1 |
|---------|-----------|-----|
| HDFS | Attention-BiLSTM | 0.9958 |
| HDFS (unsupervised) | BiLSTM-AE Optimized | 0.9571 |
| BGL | SVM / RF / DT | ≈ 0.997–0.999 |
| Spirit | Attention-BiLSTM | 0.9833 |

## Repository

[Log Anomaly Detection on GitHub](https://github.com/ademtoumi/log-anomaly-detection)

## Technologies

`Python` `PyTorch` `TensorFlow` `Scikit-learn` `FastAPI` `Apache Kafka` `PostgreSQL` `Streamlit` `SHAP` `LIME` `HuggingFace Spaces`
