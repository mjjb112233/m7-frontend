import { PackageCard } from "./PackageCard"
import { RechargePackage } from "@/app/shared/types"
import { PackageCardProps } from "../types"

interface PackageListProps {
  packages: RechargePackage[]
  selectedPackage: RechargePackage | null
  isLoading: boolean
  onPackageSelect: (pkg: RechargePackage) => void
  onPackageRecharge: (pkg: RechargePackage) => void
}

export function PackageList({ packages, selectedPackage, isLoading, onPackageSelect, onPackageRecharge }: PackageListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          isSelected={selectedPackage?.id === pkg.id}
          isLoading={isLoading}
          onSelect={onPackageSelect}
          onRecharge={onPackageRecharge}
        />
      ))}
    </div>
  )
}
