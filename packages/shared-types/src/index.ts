/**
 * Shared TypeScript types for SAM3 Annotation Platform
 * Used by both frontend (apps/web) and backend (apps/api-inference)
 */

// SAM3 API Response Types
export interface BoundingBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface MaskPolygon {
  polygons: Array<Array<[number, number]>>  // List of polygons with [x, y] coordinates
  area: number
}

export interface InferenceResult {
  num_objects: number
  boxes: Array<[number, number, number, number]>  // [[x1, y1, x2, y2], ...]
  scores: number[]
  masks: MaskPolygon[]
  processing_time_ms: number
  visualization_base64?: string
}

export interface BatchImageResult {
  image_index: number
  num_objects: number
  boxes: Array<[number, number, number, number]>
  scores: number[]
  masks: MaskPolygon[]
  visualization_base64?: string
}

export interface BatchInferenceResult {
  total_images: number
  results: BatchImageResult[]
  total_processing_time_ms: number
  average_time_per_image_ms: number
}

// Standard API Response Wrapper
export interface APIResponse<T> {
  data: T
  message: string
  status_code: number
}

// Type aliases for convenience
export type SAM3Response = APIResponse<InferenceResult>
export type SAM3BatchResponse = APIResponse<BatchInferenceResult>
