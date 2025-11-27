function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circles */}
      <circle cx="200" cy="150" r="120" fill="#ecfdf5" opacity="0.6" />
      <circle cx="200" cy="150" r="90" fill="#d1fae5" opacity="0.5" />

      {/* Image representation */}
      <rect x="100" y="80" width="200" height="140" rx="8" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2" />
      <rect x="110" y="90" width="80" height="60" rx="4" fill="#d1fae5" opacity="0.5" />
      <circle cx="190" cy="130" r="15" fill="#10b981" opacity="0.3" />

      {/* AI Brain/Processing */}
      <g transform="translate(280, 60)">
        <circle cx="0" cy="0" r="25" fill="#10b981" opacity="0.2" />
        <path
          d="M-10,-10 L-5,-5 M0,-12 L0,-3 M10,-10 L5,-5 M-10,10 L-5,5 M0,12 L0,3 M10,10 L5,5"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="0" cy="0" r="4" fill="#059669" />
      </g>

      {/* Annotation polygons/masks */}
      <g opacity="0.7">
        <polygon
          points="130,110 150,100 170,115 160,130 135,125"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <polygon
          points="190,160 210,155 220,175 200,185"
          fill="#34d399"
          opacity="0.3"
          stroke="#10b981"
          strokeWidth="2"
        />
      </g>

      {/* Arrow showing workflow */}
      <g>
        <path
          d="M 310 150 Q 330 150 330 170"
          stroke="#059669"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#059669" />
          </marker>
        </defs>
      </g>

      {/* Output/Export icon */}
      <g transform="translate(320, 200)">
        <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#10b981" opacity="0.2" />
        <path
          d="M-8,-8 L8,-8 L8,0 L4,4 L-8,4 Z M4,0 L8,0 L4,4 Z"
          fill="#10b981"
        />
      </g>

      {/* Decorative elements */}
      <circle cx="80" cy="60" r="3" fill="#34d399" />
      <circle cx="350" cy="100" r="4" fill="#10b981" opacity="0.5" />
      <circle cx="90" cy="240" r="2" fill="#059669" />
      <circle cx="340" cy="260" r="3" fill="#34d399" opacity="0.6" />
    </svg>
  )
}

export default HeroIllustration
