const buildAccess = (name) => ({
  read: `${name}_READ`,
  update: `${name}_UPDATE`,
  create: `${name}_CREATE`,
  delete: `${name}_DELETE`,
  confirm: `${name}_confirm`,
})

export default buildAccess
