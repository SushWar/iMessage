import { Skeleton } from "@chakra-ui/react"

interface SkeletonLoaderInterface {
  count: number
  height: string
  width?: string
}

export default function SkeletonLoader({
  count,
  height,
  width,
}: SkeletonLoaderInterface) {
  return (
    <>
      {[...Array(count)].map((_, idx) => {
        return (
          <Skeleton
            key={idx}
            height={height}
            width={{ base: "full" || width }}
            startColor="blackAlpha.400"
            endColor="whiteAlpha.300"
            borderRadius={4}
          />
        )
      })}
    </>
  )
}
