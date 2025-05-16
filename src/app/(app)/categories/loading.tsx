import { Skeleton } from '@/components/ui/skeleton'

export default function CategoriesLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="p-4 border border-border/50 rounded-lg"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <Skeleton className="h-5 w-2/4" />
              <Skeleton className="h-5 w-10" />
            </div>
            <Skeleton className='h-5 w-full mb-2' />
            <Skeleton className='h-5 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  )
}
