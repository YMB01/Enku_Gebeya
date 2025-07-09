export interface UpdateInventoryRequest {
    ProductID: number;
    WarehouseID: number;
    Quantity: number;
    TransactionType: string;
    Remarks?: string;
  }
  
export interface CreateProductRequest {
    ProductName: string;
    SKU: string;
    Description?: string;
    UnitPrice: number;
    QTY: number;
    WarehouseID?: number;
    Photo?: string;
}

export interface UpdateProductRequest {
    ProductName: string;
    SKU: string;
    Description?: string;
    UnitPrice: number;
    QTY?: number;
    WarehouseID?: number;
    Photo?: string;
}
  
  export interface CreateWarehouseRequest {
    WarehouseName: string;
    Location?: string;
  }
  
  export interface UpdateWarehouseRequest {
    WarehouseName: string;
    Location?: string;
  }
  
  export interface InventoryStatus {
    ProductID: number;
    ProductName: string;
    WarehouseID: number;
    WarehouseName: string;
    Quantity: number;
    [key: string]: any;
  }
  
  export interface Product {
    ProductID: number;
    ProductName: string;
    SKU: string;
    Description?: string;
    UnitPrice: number;
    QTY: number;
    WarehouseID?: number;
    [key: string]: any;
  }
  
  export interface Warehouse {
    WarehouseID: number;
    WarehouseName: string;
    Location?: string;
    [key: string]: any;
  }
  
  export interface Transaction {
    TransactionID: number;
    ProductID: number;
    WarehouseID: number;
    Quantity: number;
    TransactionType: string;
    Remarks?: string;
    TransactionDate: string;
    [key: string]: any;
  }