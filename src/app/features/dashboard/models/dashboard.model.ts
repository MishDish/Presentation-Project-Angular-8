export interface Elevator {
    id: number;
    elevatorCode: string;
    statusCode: string;
    statusDescription: string;
    lastUpdated: Date;
}

export interface ElevatorsResponse {
    count: number;
    elevators: Array<Elevator>;
}

export interface ElevatorStats {
    id: number;
    elevatorCode: string;
    stats: { [key: string]: number };
}
export interface ElevatorUpdateRequestBody {
    elevatorCode: string;
    buildingName: string;
    statusCode: string;
    account: number;
}
