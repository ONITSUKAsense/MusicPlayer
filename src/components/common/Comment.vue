<template>
  <div class="comment-item">
    <Avatar :src="comment.user.avatar" :size="40" />
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-user">{{ comment.user.nickname }}</span>
        <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
      </div>
      <p class="comment-content">{{ comment.content }}</p>
      <div class="comment-footer">
        <button class="comment-action" @click="handleLike">
          <Icon icon="carbon:thumbs-up" width="14" height="14" />
          <span>{{ comment.likes }}</span>
        </button>
        <button class="comment-action" @click="$emit('reply', comment.id)">
          <Icon icon="carbon:reply" width="14" height="14" />
          回复
        </button>
      </div>
      <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
        <Comment
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :depth="depth + 1"
          @reply="(id: number) => $emit('reply', id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Comment as CommentType } from '@/types/music'
import { formatDate } from '@/utils/format'
import Avatar from './Avatar.vue'

interface Props {
  comment: CommentType
  depth?: number
}

withDefaults(defineProps<Props>(), {
  depth: 0,
})

defineEmits<{ reply: [id: number] }>()

function handleLike() {
  // TODO: implement like
}
</script>

<style scoped lang="scss">
.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-user {
  font-size: 13px;
  font-weight: 500;
  color: $text-primary;
}

.comment-time {
  font-size: 12px;
  color: $text-muted;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: $text-primary;
  margin-bottom: 8px;
  word-break: break-word;
}

.comment-footer {
  display: flex;
  gap: 16px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: $text-muted;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: $radius-sm;
  transition: all $transition-fast;

  &:hover {
    color: $primary-light;
    background: rgba(99, 102, 241, 0.08);
  }
}

.comment-replies {
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid rgba(255, 255, 255, 0.06);
}
</style>
