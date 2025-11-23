import JSZip from 'jszip'
import type {
  Annotation,
  RectangleAnnotation,
  PolygonAnnotation,
  PointAnnotation,
  ImageData,
  Label,
} from '@/types/annotations'

export interface YOLOExportData {
  classesContent: string
  annotationFiles: Map<string, string> // image filename -> annotation content
}

/**
 * Convert annotations to YOLO format
 * YOLO format: <class-id> <x-center> <y-center> <width> <height> (all normalized 0-1)
 */
export function exportToYOLO(
  images: ImageData[],
  annotations: Annotation[],
  labels: Label[],
  pathPrefix: string = ''
): YOLOExportData {
  // Create label ID to index mapping
  const labelIdMap = new Map<string, number>()
  labels.forEach((label, index) => {
    labelIdMap.set(label.id, index)
  })

  // Create classes.txt content (one label name per line)
  const classesContent = labels.map(label => label.name).join('\n')

  // Group annotations by image
  const annotationsByImage = new Map<string, Annotation[]>()
  annotations.forEach(ann => {
    const imageAnns = annotationsByImage.get(ann.imageId) || []
    imageAnns.push(ann)
    annotationsByImage.set(ann.imageId, imageAnns)
  })

  // Create annotation files for each image
  const annotationFiles = new Map<string, string>()

  images.forEach(image => {
    const imageAnns = annotationsByImage.get(image.id) || []
    const yoloLines: string[] = []

    imageAnns.forEach(ann => {
      const classId = labelIdMap.get(ann.labelId) ?? 0
      const yoloLine = convertAnnotationToYOLO(ann, image.width, image.height, classId)
      if (yoloLine) {
        yoloLines.push(yoloLine)
      }
    })

    // Use image filename without extension for annotation file
    const imageNameWithoutExt = image.name.replace(/\.[^/.]+$/, '')
    const annotationFileName = `${imageNameWithoutExt}.txt`
    annotationFiles.set(annotationFileName, yoloLines.join('\n'))
  })

  return {
    classesContent,
    annotationFiles,
  }
}

/**
 * Convert a single annotation to YOLO format line
 */
function convertAnnotationToYOLO(
  annotation: Annotation,
  imageWidth: number,
  imageHeight: number,
  classId: number
): string | null {
  if (annotation.type === 'rectangle') {
    const rect = annotation as RectangleAnnotation

    // Convert to normalized center coordinates
    const xCenter = (rect.x + rect.width / 2) / imageWidth
    const yCenter = (rect.y + rect.height / 2) / imageHeight
    const width = rect.width / imageWidth
    const height = rect.height / imageHeight

    return `${classId} ${xCenter.toFixed(6)} ${yCenter.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`
  } else if (annotation.type === 'polygon') {
    const poly = annotation as PolygonAnnotation

    if (poly.points.length === 0) return null

    // Calculate bounding box from polygon points
    const xs = poly.points.map(p => p.x)
    const ys = poly.points.map(p => p.y)

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const width = maxX - minX
    const height = maxY - minY

    // Convert to normalized center coordinates
    const xCenter = (minX + width / 2) / imageWidth
    const yCenter = (minY + height / 2) / imageHeight
    const normWidth = width / imageWidth
    const normHeight = height / imageHeight

    return `${classId} ${xCenter.toFixed(6)} ${yCenter.toFixed(6)} ${normWidth.toFixed(6)} ${normHeight.toFixed(6)}`
  } else if (annotation.type === 'point') {
    const point = annotation as PointAnnotation

    // Treat point as a small box (10x10 pixels)
    const boxSize = 10
    const xCenter = point.x / imageWidth
    const yCenter = point.y / imageHeight
    const width = boxSize / imageWidth
    const height = boxSize / imageHeight

    return `${classId} ${xCenter.toFixed(6)} ${yCenter.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`
  }

  return null
}

/**
 * Download YOLO export as a ZIP file
 */
export async function downloadYOLOFiles(exportData: YOLOExportData) {
  const zip = new JSZip()

  // Add classes.txt to the zip
  zip.file('classes.txt', exportData.classesContent)

  // Create labels folder and add each annotation file
  const labelsFolder = zip.folder('labels')
  if (labelsFolder) {
    exportData.annotationFiles.forEach((content, filename) => {
      labelsFolder.file(filename, content)
    })
  }

  // Generate the zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' })

  // Download the zip file
  const url = URL.createObjectURL(zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `yolo_annotations_${Date.now()}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download a single YOLO annotation file
 */
export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Get a preview of YOLO export format
 */
export function getYOLOPreview(
  images: ImageData[],
  annotations: Annotation[],
  labels: Label[],
  maxLines: number = 10
): string {
  const exportData = exportToYOLO(images, annotations, labels)

  const preview: string[] = []
  preview.push('# classes.txt')
  preview.push(exportData.classesContent)
  preview.push('')

  // Show preview of first annotation file
  const firstFile = Array.from(exportData.annotationFiles.entries())[0]
  if (firstFile) {
    const [filename, content] = firstFile
    preview.push(`# ${filename}`)
    const lines = content.split('\n')
    preview.push(...lines.slice(0, maxLines))
    if (lines.length > maxLines) {
      preview.push(`... (${lines.length - maxLines} more lines)`)
    }
  }

  return preview.join('\n')
}
