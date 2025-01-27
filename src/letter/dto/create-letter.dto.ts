export class CreateLetterDto {
  title: string;
  directoryId: string;
  senderId: string;
  recipientId: string;
  senderUnitId: string;
  recipientUnitId: string;
  receivedDate: Date;
  resolverId: string;
  dueDate: Date;
  type: string;
  form: string;
  description: string;
}
