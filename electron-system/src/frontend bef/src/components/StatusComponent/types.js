import {t} from 'i18next'

const StatusBoolActive = {
  name: 'Active',
  label: t('active'),
  value: true,
  bg: 'success',
}
const StatusBoolInActive = {
  name: 'InActive',
  label: t('inActive'),
  value: false,
  bg: 'error',
}
const StatusBan = {
  name: 'ban',
  label: t('ban'),
  value: 'ban',
  bg: 'grey',
}
const StatusDisable = {
  name: 'disable',
  label: t('disable'),
  value: 'disable',
  bg: 'warning',
}
const StatusDelete = {
  name: 'delete',
  label: t('delete'),
  value: 'delete',
  bg: 'error',
}
const StatusActive = {
  name: 'Active',
  label: t('active'),
  value: 'active',
  bg: 'success',
}
const StatusOpen = {
  name: 'Open',
  label: t('open'),
  value: 'OPEN',
  bg: 'info',
}
const StatusFree = {
  name: 'Free',
  label: t('free'),
  value: 'FREE',
  bg: 'success',
}
const StatusCompleted = {
  name: 'Completed',
  label: t('completed'),
  value: 'COMPLETED',
  bg: 'success',
}
const StatusSold = {
  name: 'Sold',
  label: t('sold'),
  value: 'SOLD',
  bg: 'success',
}
const StatusDone = {
  name: 'Done',
  label: t('done'),
  value: 'DONE',
  bg: 'success',
}
const StatusInActive = {
  name: 'InActive',
  label: t('inActive'),
  value: 'INACTIVE',
  bg: 'error',
}
const StatusInActive2 = {
  name: 'In_Active',
  label: t('In_Active'),
  value: 'IN_ACTIVE',
  bg: 'error',
}
const StatusError = {
  name: 'Error',
  label: t('error'),
  value: 'ERROR',
  bg: 'error',
}
const StatusClose = {
  name: 'Close',
  label: t('Close'),
  value: 'CLOSE',
  bg: 'error',
}
const StatusBurn = {
  name: 'Burn',
  label: t('burn'),
  value: 'BURN',
  bg: 'error',
}

const StatusRejected = {
  name: 'Rejected',
  label: t('rejected'),
  value: 'REJECTED',
  bg: 'error',
}
const StatusCreating = {
  name: 'Creating',
  label: t('Creating'),
  value: 'CREATING',
  bg: 'info',
}
const StatusNormal = {
  name: 'Normal',
  label: t('Normal'),
  value: 'NORMAL',
  bg: 'info',
}
const StatusInGame = {
  name: 'In Game',
  label: t('In Game'),
  value: 'IN_GAME',
  bg: 'info',
}
const StatusInBox = {
  name: 'In Box',
  label: t('In Box'),
  value: 'IN_BOX',
  bg: 'info',
}
const StatusAuditing = {
  name: 'Auditing',
  label: t('Auditing'),
  value: 'AUDITING',
  bg: 'info',
}
const StatusInAuction = {
  name: 'In Auction',
  label: t('In Auction'),
  value: 'IN_AUCTION',
  bg: 'success',
}
const StatusInAuction2 = {
  name: 'In_Auction',
  label: t('In_Auction'),
  value: 'IN_AUCTION',
  bg: 'success',
}
const StatusPending = {
  name: 'Pending',
  label: t('pending'),
  value: 'PENDING',
  bg: 'warning',
}
const StatusNotMinted = {
  name: 'NOT_MINTED',
  label: t('NOT_MINTED'),
  value: 'NOT_MINTED',
  bg: 'info',
}
const StatusAgent = {
  name: 'Agent',
  label: t('agent'),
  value: 'AGENT',
  bg: 'primary',
}
const managersStatus = {
  array: [StatusBoolActive, StatusBoolInActive],
  obj: [StatusBoolActive, StatusBoolInActive].reduce((hash, status) => {
    hash[status.value] = status
    return hash
  }, {}),
}

export const globalStatus = [StatusActive, StatusDisable, StatusDelete]
export const userStatus = [StatusActive, StatusDisable, StatusBan, StatusDelete]

const BasicStatus = [
  StatusActive,
  StatusInActive,
  StatusCreating,
  StatusError,
  StatusOpen,
  StatusAgent,
  StatusInAuction2,
  StatusInAuction,
  StatusInGame,
  StatusNormal,
  StatusClose,
  StatusInActive2,
  StatusCompleted,
  StatusFree,
  StatusSold,
  StatusInBox,
  StatusPending,
  StatusDone,
  StatusRejected,
  StatusAuditing,
  StatusNotMinted,
  StatusBurn,
]
const StatusObj = {
  [StatusActive.value]: StatusActive.name,
  [StatusInActive.value]: StatusInActive.name,
  [StatusCreating.value]: StatusCreating.name,
  [StatusError.value]: StatusError.name,
  [StatusOpen.value]: StatusOpen.name,
  [StatusAgent.value]: StatusAgent.name,
  [StatusInAuction2.value]: StatusInAuction2.name,
  [StatusInAuction.value]: StatusInAuction.name,
  [StatusInGame.value]: StatusInGame.name,
  [StatusNormal.value]: StatusNormal.name,
  [StatusClose.value]: StatusClose.name,
  [StatusInActive2.value]: StatusInActive2.name,
  [StatusCompleted.value]: StatusCompleted.name,
  [StatusFree.value]: StatusFree.name,
  [StatusSold.value]: StatusSold.name,
  [StatusInBox.value]: StatusInBox.name,
  [StatusPending.value]: StatusPending.name,
  [StatusDone.value]: StatusDone.name,
  [StatusRejected.value]: StatusRejected.name,
  [StatusAuditing.value]: StatusAuditing.name,
  [StatusNotMinted.value]: StatusNotMinted.name,
  [StatusBurn.value]: StatusBurn.name,
}
const StatusData = {
  [StatusActive.value]: StatusActive,
  [StatusInActive.value]: StatusInActive,
  [StatusBan.value]: StatusBan,
  [StatusDisable.value]: StatusDisable,
  [StatusDelete.value]: StatusDelete,
  [StatusCreating.value]: StatusCreating,
  [StatusError.value]: StatusError,
  [StatusOpen.value]: StatusOpen,
  [StatusAgent.value]: StatusAgent,
  [StatusInAuction2.value]: StatusInAuction2,
  [StatusInAuction.value]: StatusInAuction,
  [StatusInGame.value]: StatusInGame,
  [StatusNormal.value]: StatusNormal,
  [StatusClose.value]: StatusClose,
  [StatusInActive2.value]: StatusInActive2,
  [StatusCompleted.value]: StatusCompleted,
  [StatusFree.value]: StatusFree,
  [StatusSold.value]: StatusSold,
  [StatusInBox.value]: StatusInBox,
  [StatusPending.value]: StatusPending,
  [StatusDone.value]: StatusDone,
  [StatusRejected.value]: StatusRejected,
  [StatusAuditing.value]: StatusAuditing,
  [StatusNotMinted.value]: StatusNotMinted,
  [StatusBurn.value]: StatusBurn,
  [StatusBoolActive.value]: StatusBoolActive,
  [StatusBoolInActive.value]: StatusBoolInActive,
}
const BasicStatusByValue = BasicStatus.reduce((hash, status) => {
  hash[status.value] = status
  return hash
}, {})

export {BasicStatus, managersStatus, BasicStatusByValue, StatusObj, StatusData}
