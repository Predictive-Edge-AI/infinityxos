import { TopOpportunities } from "@/components/top-opportunities"

export default function RiskCategoryPage({ params }: { params: { risk: string } }) {
  return (
    <div className="container mx-auto py-6">
      <TopOpportunities riskLevel={params.risk} />
    </div>
  )
}

