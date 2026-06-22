export type UseCase = "merchant" | "wire" | "ap2";

const USE_CASES: UseCase[] = ["merchant", "wire", "ap2"];

export const parseUseCase = (s: string | undefined): UseCase | null => {
  if (s === undefined) {
    return null;
  }
  for (const useCase of USE_CASES) {
    if (s === useCase) {
      return s as UseCase;
    }
  }
  return null;
};

export const NONCE = "3f947e15-fcf0-4cd7-9030-61fde6632322";
