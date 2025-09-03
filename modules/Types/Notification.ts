export type NotificationArguments = {
    title: string,
    bodyText: string,
    type: string,
    duration?: number,
    backgroundColor?: string,
    html?: boolean
}

export type NotificationType = {
    backgroundColor: string;
    class?: string;
    attr?: string
}