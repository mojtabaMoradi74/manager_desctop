import buildAccess from './buildAccess';
import { travelTypeObject } from '../enumeration/index';

const permissions = {
  travel: { name: 'Travel', access: buildAccess('Travel', travelTypeObject.omre.type) },
  travelRegister: { name: 'TravelRegister', access: buildAccess('TravelRegister', travelTypeObject.omre.type) },
  team: { name: 'Team', access: buildAccess('Team', travelTypeObject.omre.type) },
};
export default permissions;
export const TravelRegisterTamatoPermission = buildAccess('TravelRegister');

export const permission = {
  read: 'Permission read',
  update: 'Permission update',
  create: 'Permission create',
  delete: 'Permission delete',
};

export const rolePermission = {
  read: 'role read',
  update: 'role update',
  create: 'role create',
  delete: 'role delete',
};

export const ticketPermission = {
  read: 'Ticket read',
  update: 'Ticket update',
  create: 'Ticket create',
  delete: 'Ticket delete',
};

export const sellerToReportagePermission = {
  read: 'SellerToReportage read',
  update: 'SellerToReportage update',
  create: 'SellerToReportage create',
  delete: 'SellerToReportage delete',
};

export const transactionPermission = {
  read: 'Transaction read',
  update: 'Transaction update',
  create: 'Transaction create',
  delete: 'Transaction delete',
};

export const newsAgencyPermission = {
  read: 'NewsAgency read',
  update: 'NewsAgency update',
  create: 'NewsAgency create',
  delete: 'NewsAgency delete',
};

export const reportagePermission = {
  read: 'Reportage read',
  update: 'Reportage update',
  create: 'Reportage create',
  delete: 'Reportage delete',
};

export const reportageToClientPermission = {
  read: 'ReportageToClient read',
  update: 'ReportageToClient update',
  create: 'ReportageToClient create',
  delete: 'ReportageToClient delete',
};

export const adminPermission = {
  read: 'Admin read',
  update: 'Admin update',
  create: 'Admin create',
  delete: 'Admin delete',
};

export const sellerPermission = {
  read: 'Seller read',
  update: 'Seller update',
  create: 'Seller create',
  delete: 'Seller delete',
};
