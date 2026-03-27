# OpenVLA: An Open-Source Vision-Language-Action Model

> **발표:** 2024-06-13 · arXiv [2406.09246](https://arxiv.org/abs/2406.09246)
> **저자:** Moo Jin Kim, Karl Pertsch, Siddharth Karamcheti, Ted Xiao, Ashwin Balakrishna, Suraj Nair, Rafael Rafailov, Ethan Foster, Grace Lam, Pannag Sanketi, Quan Vuong, Thomas Kollar, Benjamin Burchfiel, Russ Tedrake, Dorsa Sadigh, Sergey Levine, Percy Liang, Chelsea Finn
> **리소스:** [GitHub](https://github.com/openvla/openvla) · [HuggingFace](https://huggingface.co/openvla/openvla-7b)

---

## 한 줄 요약

OpenVLA는 완전 오픈소스 7B 파라미터 VLA 모델로, RT-2(55B)보다 7배 작은 크기로 그에 필적하거나 능가하는 로봇 조작 성능을 보여준다. **Prismatic VLM** 백본(SigLIP + DINOv2 비전 인코더 + Llama 2 7B) 위에 구축되었으며, **Open X-Embodiment(OXE)** 데이터셋(22개 로봇, 527가지 스킬, 97만 개 궤적)으로 학습한다.

핵심 인사이트: 강력한 오픈 VLM 백본을 다양한 대규모 로봇 데이터로 훈련하면 7B 모델이 55B 클로즈드 모델을 능가할 수 있으며, LoRA를 사용해 ~100개 데모만으로 새 로봇과 태스크에 적응 가능하다.

---

## 상세 요약

### 문제 의식

RT-2는 웹 스케일 VLM이 로봇 제어에 전용될 수 있음을 입증했지만:
- 가중치 비공개 → 재현 불가
- 55B 파라미터 → 운용·파인튜닝 비용 과다
- 학습 데이터 미공개 → 실패 원인 분석 어려움
- 커뮤니티가 발전시키기 어려운 구조

### 아키텍처

OpenVLA는 **Prismatic VLM** 아키텍처 기반이다:

- **비전 인코더 (듀얼)**: SigLIP(언어-이미지 사전학습) + DINOv2(자기지도 ViT); 두 피처를 concat해 더 풍부한 시각 표현 확보
- **프로젝션**: 연결된 시각 피처를 LLM 토큰 공간으로 매핑하는 선형 레이어
- **언어 모델**: Llama 2 7B (decoder-only); 시각 토큰 + 텍스트 토큰을 함께 처리
- **액션 예측**: 다른 텍스트 토큰처럼 액션 토큰을 자기회귀 방식으로 예측

### 액션 표현

로봇 액션은 **7차원 벡터**로 표현된다:
- 6-DoF 엔드이펙터 델타 (Δx, Δy, Δz, Δroll, Δpitch, Δyaw)
- 1 그리퍼 명령 (개폐)

7개 차원 각각을 **256개 빈으로 이산화**하고 LLM 어휘에서 텍스트 토큰으로 표현한다. 모델은 이 7개 토큰을 텍스트 생성과 동일한 방식으로 순차 예측한다. RT-2와 동일한 토큰 기반 접근이지만, 완전 오픈소스로 구현했다.

### 학습 데이터: Open X-Embodiment (OXE)

- **97만 개 궤적**, 22개 로봇 embodiment
- 다양한 환경에서 527가지 고유 스킬
- 원격조작 데모, 스크립트 정책, 인간 영상 혼합
- 공개 데이터셋 → 학습 재현 가능

OpenVLA는 embodiment와 스킬 유형 간 균형을 위해 세심하게 조정된 **데이터 믹스처**를 사용한다 — 희귀 스킬은 오버샘플링, 과대표 데이터는 다운샘플링.

### 실험 결과

**BridgeV2 벤치마크** (실제 로봇, 미학습 물체):
- OpenVLA (7B): 73.7% 성공률
- RT-2-X (55B): 67.3% 성공률

**Google Robot 벤치마크** (탁상 조작):
- OpenVLA (7B): 7배 적은 파라미터로 RT-2-X에 필적

**핵심 발견**: 동일한 다양한 데이터로 학습하면 잘 훈련된 7B 오픈 모델이 55B 클로즈드 모델을 능가한다.

### LoRA 파인튜닝

OpenVLA는 새 로봇과 태스크에 효율적으로 적응 가능하다:
- **LoRA (Low-Rank Adaptation)**: 대부분 파라미터를 동결하고 저랭크 어댑터만 학습
- 새 태스크의 데모 ~100개로 강력한 성능 달성
- A100 단일 GPU에서 7B 모델 파인튜닝: 수일이 아닌 수시간

이로써 커스텀 하드웨어나 새 태스크 도메인에 VLA를 배포하는 장벽이 크게 낮아진다.

### 한계

- **추론 속도**: A100에서 ~6 Hz — 55B RT-2보다는 빠르지만 고주파 제어에는 여전히 제한적
- **단일 이미지 입력**: 한 번에 카메라 프레임 하나 처리; 프레임 간 시간적 모델링 없음
- **고정 액션 공간**: 7-DoF 조작 설계; 다른 액션 공간(바이매뉴얼, 모바일 등)은 아키텍처 변경 필요
- **분포 이동**: 학습 분포 밖의 장면·물체에서 여전히 실패

---

## 의의

OpenVLA는 **오픈 + 다양한 데이터 + 적절한 모델 크기**가 클로즈드 + 스케일 접근을 이길 수 있음을 보여주며 VLA 판도를 바꿨다:

1. 커뮤니티가 VLA를 직접 구축·연구·개선할 수 있게 됨 (API 사용에 의존하지 않고)
2. 이 스케일에서는 데이터 다양성이 모델 크기보다 중요함
3. 파인튜닝이 실용적: ~100 데모 + LoRA → 새 하드웨어에 배포 가능

---

## Config 적용 포인트

- **벤치마크 기준선**: OpenVLA는 현재 VLA 비교의 표준 오픈소스 레퍼런스
- **파인튜닝 경로**: LoRA + ~100 데모가 새 embodiment 적응의 실용적인 템플릿
- **액션 토큰화**: 7-DoF → 256빈 이산화 방식은 검증된 액션 표현 설계 선택지
- **데이터 전략**: OXE 믹스처 논리가 다양한 학습 코퍼스의 구성·균형 방법을 직접 제시
- **바이매뉴얼 스케일링**: OpenVLA의 단일 팔 설정이 출발점; 14-DoF 바이매뉴얼로 확장 시 액션 표현과 협응 구조의 재설계 필요

---

## 참고

- [RT-2](./rt-2.md/) — 클로즈드 소스 선행 연구
- [VLA](../03-domains/02-model-class/05-vla.md/) — VLA 아키텍처 개요
- [VLM](../03-domains/02-model-class/04-vlm.md/) — VLM 기초
