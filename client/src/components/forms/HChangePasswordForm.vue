<script setup lang="ts">
import { computed, ref } from "vue"
import { HButton } from "@/ui/button/"
import { HIcon, HIconName } from "@/ui/icon"
import { HInput } from "@/ui/input"
import { HPopover } from "@/ui/popover"
import { IChangePasswordFormPayload } from "./interface"

const emits = defineEmits<{
  (e: "change-password", payload: IChangePasswordFormPayload): void
}>()
const oldPassword = ref("")
const newPassword = ref("")
const verifyPassword = ref("")
const isSame = computed(() => newPassword.value === verifyPassword.value)
const error = computed(() => {
  if (!verifyPassword.value) return ""
  return !isSame.value ? "The Passwords is different" : ""
})
const disabled = computed(
  () =>
    !!error.value ||
    !oldPassword.value ||
    !newPassword.value ||
    !verifyPassword.value
)
const onChange = () =>
  emits("change-password", {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  })
</script>
<template>
  <div>
    <HInput
      attr-type="password"
      placeholder="Old password"
      type="secondary"
      v-model="oldPassword"
      error=""
    >
      <template #prefix>
        <HIcon :name="HIconName.Lock" />
      </template>
    </HInput>
    <HInput
      attr-type="password"
      placeholder="New password"
      type="secondary"
      v-model="newPassword"
      :error="error"
    >
      <template #prefix>
        <HIcon :name="HIconName.Lock" />
      </template>
    </HInput>
    <HInput
      attr-type="password"
      placeholder="Vertify password"
      type="secondary"
      v-model="verifyPassword"
      :error="error"
    >
      <template #prefix>
        <HIcon :name="HIconName.Lock" />
      </template>
    </HInput>
    <div class="mt-2">
      <HButton class="mr-2" :disabled="disabled" @click="onChange">
        Change password
      </HButton>
      <HButton inverted>
        Lost password
        <HPopover position="bottom-left">
          <div class="text-xs max-w-sm">
            Run
            <span class="font-mono">pnpm resetpwd</span>
            reset password
          </div>
        </HPopover>
      </HButton>
    </div>
  </div>
</template>
