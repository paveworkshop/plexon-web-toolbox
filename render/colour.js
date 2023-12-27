export const HexColour = (rgb) => "#" + rgb.map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? "0" + hex : hex
}).join("")


export const RandomColour = (rgb) => {
  return HexColour([255, 255, 255].map(v => Math.round(Math.random()*v))) 
}


