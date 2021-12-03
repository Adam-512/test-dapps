export const shortAddress = (str ='')=> {
  return `${str.slice(0, 6)}...${str.slice(-4)}`
}