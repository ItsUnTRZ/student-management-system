// Loading Spinner Component
// ไฟล์นี้แสดง loading animation ขณะโหลดข้อมูล

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'กำลังโหลด...' 
}) => {
  // กำหนดขนาดของ spinner
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Spinner animation */}
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-primary-600`}
      />
      {/* Loading text */}
      {text && (
        <p className="mt-4 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner
