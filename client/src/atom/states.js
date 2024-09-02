
import { atom } from "recoil";

export const pilotData = atom({
    key: 'pilotData', 
    default: null,
  });

export const userData = atom({
    key: 'userData', 
    default: null,
  });

export const pilotProject = atom({
    key: 'pilotProject', 
    default: [],
  });
  
export const logData = atom({
    key: 'logData', 
    default: [],
  });

export const assetData = atom({
    key: 'assetData', 
    default: null,
  });

  export const PageLoader = atom({
    key: 'PageLoader', 
    default: false,
  });
  export const SidebarState = atom({
    key: 'SidebarState', 
    default: false,
  });