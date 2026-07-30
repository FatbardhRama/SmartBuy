export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function isValidEmail(value: unknown): boolean {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidId(value: unknown): boolean {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return /^[A-Za-z0-9]+$/.test(value.trim());
}

export function isValidPositiveNumber(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue > 0;
  }

  return false;
}

export function isValidOrderStatus(value: unknown): boolean {
  return (
    typeof value === "string" &&
    ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(
      value.toUpperCase()
    )
  );
}
