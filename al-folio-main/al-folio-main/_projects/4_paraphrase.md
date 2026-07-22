---
layout: page
title: Paraphrase Detection with Siamese Neural Networks
description: NLP & Deep Learning Project — ESI-SBA, 2024–2025
img:
importance: 4
category: AI & Data Science
---

Sentence-level semantic similarity using a **Siamese BiLSTM** architecture with multi-head attention, trained on two large-scale datasets.

## Architecture

- **Encoder:** 3-layer BiLSTM (512 hidden units per direction) with dropout.
- **Attention:** 4-head multi-head attention over BiLSTM outputs.
- **Training data:** PAWS (~49K pairs) and Quora Question Pairs (~400K pairs).
- **Augmentation:** WordNet synonym replacement for linguistic diversity.
- **Loss:** Focal Loss (α=0.75, γ=2) to handle class imbalance.

## Repository

[Paraphrase Detection on GitHub](https://github.com/ademtoumi/Paraphrase-Detection)

## Technologies

`Python` `PyTorch` `spaCy` `NLTK`
