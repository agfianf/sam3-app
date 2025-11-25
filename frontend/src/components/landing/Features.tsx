import { Database, Download, Keyboard, Layers, Sparkles, Target } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Segmentation',
    description: 'SAM3 integration for automatic object detection with text or bounding box prompts',
  },
  {
    icon: Target,
    title: 'Manual Precision Tools',
    description: 'Rectangle, polygon, and point annotation tools with pixel-perfect control',
  },
  {
    icon: Layers,
    title: 'Batch Processing',
    description: 'Annotate multiple images at once with batch SAM3 inference',
  },
  {
    icon: Download,
    title: 'Export Flexibility',
    description: 'Export to COCO JSON, YOLO format, or ZIP archives with one click',
  },
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    description: 'Lightning-fast workflow with comprehensive keyboard shortcuts',
  },
  {
    icon: Database,
    title: 'Browser-Based Storage',
    description: 'Your data stays local with IndexedDB - no server uploads required',
  },
]

function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Annotate
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed for speed, accuracy, and ease of use
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:glass transition-all duration-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                  <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
