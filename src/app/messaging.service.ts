import { Injectable, Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Injectable()
export class MessagingService {

	private _messages: Message[] = [];
	private _archivedMeesages: Message[] = [];
	get messages(): Message[] {
		return this._messages;
	}
	set messages(messages: Message[]) {
		this._messages = messages;
	}
	get archivedMessages(): Message[] {
		return this._archivedMeesages;
	}
	set archivedMessages(archivedMessages: Message[]) {
		this._archivedMeesages = archivedMessages;
	}
	getMessages(): Message[] {
		return this._messages;
	}
	addMessage(message: Message) {
		this._messages.push(message);
	}
	addMessages(messages: Message[]) {
		for (let i = 0; i++; i < messages.length) {
			this._messages.push(messages[i]);
		}
	}
	getMessageById(id: string): Message {
		return this._messages.find((message: Message) => message.id === id);
	}
	deleteMessageById(id: string) {
		// this._archivedMeesages.push(this._messages.filter((message: Message) => message.id === id));
		this._messages = this._messages.filter((message: Message) => message.id !== id);
		this._archivedMeesages.push(this.getMessageById(id));
	}
	deleteMessage(index: string | number) {
		if (typeof index === 'number') {
			this._archivedMeesages.push(this._messages[index]);
			this._messages.splice(index, 1);
		} else {
			this.deleteMessageById(index);
		}
	}
	deleteMessages() {
		this._messages = [];
	}
	/**
	 * Adds a message to archived message
	 * NOTE: When {@link MessagingService#deleteMessage} is called, it will also call this method
	 * @param message {Message} The message
	 */
	addArchivedMessage(message: Message) {
		this._archivedMeesages.push(message);
	}
}
@Component({
	selector: 'message-card',
	template: `
	<mat-card>
		<mat-card-header>
			<mat-card-title>{{message.category}}</mat-card-title>
			<mat-card-subtitle>{{message.date | date}}</mat-card-subtitle>
			<span fxFlex></span>
			<button mat-icon-button (click)="messagingService.deleteMessage(message.id)">
				<mat-icon>close</mat-icon>
			</button>
		</mat-card-header>
		<mat-card-title>{{message.title}}</mat-card-title>
		<mat-card-content *ngIf="message.content !== null">
			<p>{{message.content}}</p>
		</mat-card-content>
		<mat-card-actions align="end" *ngIf="message.actions">
			<ng-template *ngFor="let action of message.actions">
				<button mat-icon-button [matTooltip]="action.tooltipText" color="primary" *ngIf="action.icon !== null && action.title === null" (click)="action.onClickListener($event)">
					<mat-icon *ngIf="action.icon">{{action.icon}}</mat-icon>
				</button>
				<button mat-button [matTooltip]="action.tooltipText" color="primary" *ngIf="action.icon === null && action.title !== null" (click)="action.onClickListener($event)">
					{{action.title}}
				</button>
			</ng-template>
		</mat-card-actions>
	</mat-card>
	`
})
export class MessageCardComponent {
	constructor(
		// TODO(Edric): Figure out a way to make this private
		public messagingService: MessagingService
	) { }
	@Input() message: Message;
	@Input() index: number;
}

export interface MessageGroup {
	/**
	 * Messages of the group
	 */
	messages: Message[];
	/**
	 * The title of the group
	 */
	title: string;
}
export interface Message {
	/**
	 * The title of the message
	 */
	title: string;
	/**
	 * The image of the message
	 */
	img?: string;
	/**
	 * The action buttons of the message 
	 */
	actions?: MessageAction[];
	/** 
	 * Whether to disable the dismiss button
	 */
	disableDismiss?: boolean;
	/**
	 * The id of the message
	 */
	id: string;
	/**
	 * The date that the message was sent
	 */
	date: Date | number;
	/**
	 * The category of the message
	 */
	category?: string;
	/**
	 * The content of the message
	 */
	content?: string;
	/**
	 * The importance level of the message
	 */
	importanceLevel: MessageImportance;
}
export interface MessageAction {
	/** 
	 * Whether the action button is an icon button
	 */
	isIconBtn?: boolean;
	/**
	 * The name of the icon
	 * Note: If this property is specified, it'll be automatically assumed to be an icon button
	 */
	icon?: string;
	/**
	 * The title of the action button
	 * Note: If this property is specified, it'll be automatically assumed to be a normal button
	 */
	title?: string;
	/**
	 * The tooltip text of the action button
	 * Note: If the `title` property is specified, this property will be ignored
	 */
	tooltipText?: string;
	/**
	 * The color of the action button
	 */
	color?: ThemePalette;
	/**
	 * The on click listener for the action button
	 */
	onClickListener?: (ev: Event) => void;
}

export enum MessageImportance {
	Low,
	Medium,
	High,
	Critical
}