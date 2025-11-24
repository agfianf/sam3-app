import { useState, useEffect } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'
import { Button } from './ui/button'
import type { Label, ImageData } from '@/types/annotations'
import { sam3Client } from '@/lib/sam3-client'
import toast from 'react-hot-toast'

interface TextPromptPanelProps {
  labels: Label[]
  selectedLabelId: string | null
  currentImage: ImageData | null
  onAnnotationsCreated: (results: {
    boxes: Array<[number, number, number, number]>
    masks: Array<{ polygons: Array<Array<[number, number]>>; area: number }>
    scores: number[]
    annotationType: 'bbox' | 'polygon'
    labelId?: string
  }) => void
  onClose: () => void
}

type AnnotationType = 'bbox' | 'polygon'

export function TextPromptPanel({
  labels,
  selectedLabelId,
  currentImage,
  onAnnotationsCreated,
  onClose,
}: TextPromptPanelProps) {
  const [textPrompt, setTextPrompt] = useState('')
  const [labelId, setLabelId] = useState(selectedLabelId || '')
  const [threshold, setThreshold] = useState(0.25)
  const [maskThreshold, setMaskThreshold] = useState(0.25)
  const [annotationType, setAnnotationType] = useState<AnnotationType>('polygon')
  const [isLoading, setIsLoading] = useState(false)

  // Sync labelId with selectedLabelId from parent
  useEffect(() => {
    if (selectedLabelId) {
      setLabelId(selectedLabelId)
    }
  }, [selectedLabelId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentImage) {
      toast.error('No image selected')
      return
    }

    if (!textPrompt.trim()) {
      toast.error('Please enter a text prompt')
      return
    }

    if (!labelId) {
      toast.error('Please select a label')
      return
    }

    setIsLoading(true)

    try {
      // Convert blob to File
      const imageFile = new File([currentImage.blob], currentImage.name, {
        type: currentImage.blob.type,
      })

      // Call text prompt API
      const response = await sam3Client.textPrompt({
        image: imageFile,
        text_prompt: textPrompt,
        threshold,
        mask_threshold: maskThreshold,
        return_visualization: false,
      })

      const { num_objects, boxes, masks, scores } = response.data

      if (num_objects === 0) {
        toast.error('No objects detected. Try adjusting thresholds or prompt.')
        return
      }

      // Use selected annotation type and label
      onAnnotationsCreated({ boxes, masks, scores, annotationType, labelId })

      toast.success(`Successfully detected ${num_objects} object${num_objects > 1 ? 's' : ''}!`)

      // Reset form
      setTextPrompt('')
    } catch (error) {
      console.error('Text-prompt auto-annotate error:', error)
      toast.error('Failed to auto-annotate. Please check the backend connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedLabel = labels.find((l) => l.id === labelId)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-white">Text-Prompt</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Description */}
        <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-3">
          <p className="text-sm text-purple-200">
            Describe what objects you want to detect in natural language. The AI will automatically find and segment them.
          </p>
        </div>

        {/* Text Prompt Input */}
        <div>
          <label htmlFor="textPrompt" className="block text-sm font-medium text-gray-300 mb-2">
            Text Prompt
          </label>
          <input
            type="text"
            id="textPrompt"
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            placeholder="e.g., truck plate, person, car"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-400">
            Describe the object(s) you want to detect
          </p>
        </div>

        {/* Label Selection */}
        <div>
          <label htmlFor="labelSelect" className="block text-sm font-medium text-gray-300 mb-2">
            Assign Label
          </label>
          <div className="relative">
            <select
              id="labelSelect"
              value={labelId}
              onChange={(e) => setLabelId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              disabled={isLoading}
            >
              <option value="">Select a label...</option>
              {labels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>
            {selectedLabel && (
              <div
                className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded"
                style={{ backgroundColor: selectedLabel.color }}
              />
            )}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            All detected objects will be tagged with this label
          </p>
        </div>

        {/* Annotation Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Annotation Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="annotationType"
                value="polygon"
                checked={annotationType === 'polygon'}
                onChange={(e) => setAnnotationType(e.target.value as AnnotationType)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                disabled={isLoading}
              />
              <div>
                <div className="text-white font-medium">Polygon / Mask</div>
                <div className="text-sm text-gray-400">
                  Precise segmentation masks following object contours
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="annotationType"
                value="bbox"
                checked={annotationType === 'bbox'}
                onChange={(e) => setAnnotationType(e.target.value as AnnotationType)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                disabled={isLoading}
              />
              <div>
                <div className="text-white font-medium">Bounding Box</div>
                <div className="text-sm text-gray-400">
                  Rectangular boxes around detected objects
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Threshold Settings */}
        <div className="space-y-4">
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-300 mb-2">
              Detection Threshold: {threshold.toFixed(2)}
            </label>
            <input
              type="range"
              id="threshold"
              min="0"
              max="1"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-400">
              Higher values = more confident detections (fewer results)
            </p>
          </div>

          <div>
            <label htmlFor="maskThreshold" className="block text-sm font-medium text-gray-300 mb-2">
              Mask Threshold: {maskThreshold.toFixed(2)}
            </label>
            <input
              type="range"
              id="maskThreshold"
              min="0"
              max="1"
              step="0.05"
              value={maskThreshold}
              onChange={(e) => setMaskThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-400">
              Controls segmentation mask precision
            </p>
          </div>
        </div>
      </form>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-700">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !textPrompt.trim() || !labelId || !currentImage}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Run Auto-Annotate
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
