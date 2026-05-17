import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  RecipeChatRequestDto,
  RecipeChatResponseDto,
} from './dto/recipe-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('recipe')
  async suggestRecipeIngredients(
    @Body() request: RecipeChatRequestDto,
  ): Promise<RecipeChatResponseDto> {
    return this.chatService.suggestRecipeIngredients(request);
  }
}
