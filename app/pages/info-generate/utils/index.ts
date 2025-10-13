import { GeneratedInfo } from "../types"

export const cardColors = [
  { from: "emerald-50", to: "green-50", border: "emerald-200", accent: "emerald-500" },
  { from: "purple-50", to: "violet-50", border: "purple-200", accent: "purple-500" },
  { from: "rose-50", to: "pink-50", border: "rose-200", accent: "rose-500" },
  { from: "amber-50", to: "orange-50", border: "amber-200", accent: "amber-500" },
  { from: "indigo-50", to: "blue-50", border: "indigo-200", accent: "indigo-500" },
]

export const getCardColorTheme = (index: number) => {
  return cardColors[index % cardColors.length]
}

export const formatGeneratedInfo = (info: GeneratedInfo): string => {
  return `卡号: ${info.cardNumber}\n有效期: ${info.month}/${info.year}\n姓名: ${info.fullName}\n电话: ${info.phone}\n地址: ${info.address}\n城市: ${info.city}\n州: ${info.state}\n邮编: ${info.zipCode}\n国家: ${info.country}`
}

export const generateCSVContent = (data: GeneratedInfo[]): string => {
  return "data:text/csv;charset=utf-8," +
    "卡号,有效期,姓名,电话,地址,城市,州,邮编,国家\n" +
    data
      .map(
        (info) =>
          `${info.cardNumber},${info.month}/${info.year},${info.fullName},${info.phone},${info.address},${info.city},${info.state},${info.zipCode},${info.country}`,
      )
      .join("\n")
}

export const downloadCSV = (csvContent: string, filename: string = "generated_info.csv") => {
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
