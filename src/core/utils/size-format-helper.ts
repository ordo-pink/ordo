const convertBytesToMb = (bytes: number, fixed = 0) =>
  Number((bytes / 8 / 1024 / 1024).toFixed(fixed))

export { convertBytesToMb }
