export type Rotation = {
  id: string;
  name: string;
  crops: string[];
  score: number;
  tone: "blue" | "green" | "pink";
  summary: string;
  explanation: string;
  strengths: string[];
  tradeoff: string;
  priorityMetrics?: { label: string; value: number; tone: "blue" | "green" | "pink" | "amber" }[];
};

export const ROTATIONS: Rotation[] = [
  {
    id: "option-1",
    name: "Water-Smart Rotation",
    crops: ["Rice", "Corn", "Vegetables"],
    score: 82,
    tone: "blue",
    summary:
      "Prioritizes lower water demand while keeping climate suitability strong.",
    explanation:
      "A placeholder plan focused on conserving water while maintaining a strong climate fit.",
    strengths: [
      "Lower estimated water pressure",
      "Good fit for rain-fed planning",
      "Keeps multiple crop options available",
    ],
    tradeoff: "Potential productivity may vary during unusually dry periods.",
  },
  {
    id: "option-2",
    name: "Soil Builder Rotation",
    crops: ["Corn", "Legumes", "Rice"],
    score: 78,
    tone: "green",
    summary:
      "Adds a soil-restoring crop between seasons to support long-term soil health.",
    explanation:
      "A placeholder plan that gives soil health more weight between production seasons.",
    strengths: [
      "Includes a soil-restoring crop",
      "Supports crop diversity",
      "May improve long-term soil condition",
    ],
    tradeoff:
      "May require an extra planning step and a temporary lower-return crop.",
  },
  {
    id: "option-3",
    name: "Climate Fit Rotation",
    crops: ["Mung bean", "Sweet potato", "Vegetables"],
    score: 75,
    tone: "pink",
    summary:
      "Balances crop diversity with the projected climate conditions for the selected area.",
    explanation:
      "A placeholder plan that balances climate suitability with a diverse crop mix.",
    strengths: [
      "Diversifies farm production",
      "Balances climate suitability",
      "Offers several harvest windows",
    ],
    tradeoff: "Different crops may require different management practices.",
  },
];
