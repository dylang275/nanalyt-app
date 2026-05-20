import { useNavigate, useParams } from 'react-router-dom'

function PerformanceProduct() {
  const navigate = useNavigate()
  const { slug } = useParams()

  return (
    <div className="font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-5 pb-12">
        <button
          onClick={() => navigate('/performance')}
          className="text-[12px] font-medium text-ink bg-transparent border-0 cursor-pointer hover:opacity-70 mb-[18px]"
        >
          ← Back to Performance
        </button>

        <div className="bg-white border-[0.5px] border-[#e5e7eb] rounded-[10px] px-6 py-12 flex items-center justify-center">
          <div className="text-[13px] text-ink">
            Product detail coming in Phase 2 · <span className="font-mono">{slug}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceProduct
