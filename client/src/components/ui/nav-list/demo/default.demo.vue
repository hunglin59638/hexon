<script setup lang="ts">
import { computed } from "vue"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import { HNavList, NavListItem } from ".."
import { HIconName } from "../../icon"

const t = useTheme<HTheme>()!
const colors = computed(() => ({
  deploy: t.value.color.primary.n,
  generate: t.value.color.primary.n,
  clean: t.value.color.error.n,
  gitsave: t.value.color.primary.n,
  gitsync: t.value.color.error.n,
  all: t.value.color.all,
  post: t.value.color.post,
  page: t.value.color.page,
  draft: t.value.color.draft,
}))
const model: NavListItem[] = [
  { type: "title", label: "Operation" },
  {
    type: "item",
    text: "Deploy",
    icon: HIconName.Airplane,
    color: colors.value.deploy,
    key: "deploy",
  },
  {
    type: "item",
    text: "Generate",
    icon: HIconName.Library,
    color: colors.value.generate,
    key: "generate",
  },
  {
    type: "item",
    text: "Clean",
    icon: HIconName.EraseTool,
    color: colors.value.clean,
    key: "clean",
  },
  {
    type: "item",
    text: "Sync to Git",
    icon: HIconName.Upload,
    color: colors.value.gitsave,
    key: "gitsave",
  },
  {
    type: "item",
    text: "Sync from Git",
    icon: HIconName.Download,
    color: colors.value.gitsync,
    key: "gitsync",
  },
  {
    type: "title",
    label: "Selection",
  },
  {
    type: "item",
    text: "Total",
    icon: HIconName.Home,
    sub: 4,
    color: colors.value.all,
    selected: true,
    key: "all",
  },
  {
    type: "item",
    text: "Post",
    icon: HIconName.Edit,
    sub: 2,
    color: colors.value.post,
    selected: false,
    key: "post",
  },
  {
    type: "item",
    text: "Page",
    icon: HIconName.Page,
    sub: 1,
    color: colors.value.page,
    selected: false,
    key: "page",
  },
  {
    type: "item",
    text: "Draft",
    icon: HIconName.Read,
    sub: 1,
    color: colors.value.draft,
    selected: false,
    key: "draft",
  },
  {
    type: "title",
    label: "Category",
  },
  {
    type: "item",
    text: "Category 1",
    indent: 0,
    icon: HIconName.Folder,
    color: t.value.color.folder,
    sub: 3,
    key: "c1",
  },
  {
    type: "item",
    text: "Category 2",
    indent: 0,
    icon: HIconName.Folder,
    color: t.value.color.folder,
    sub: 3,
    key: "c2",
  },
  {
    type: "item",
    text: "Category 2 sub",
    indent: 1,
    icon: HIconName.Folder,
    color: t.value.color.folder,
    sub: 1,
    key: "c21",
  },
]
const onSelect = (value: string) => {
  console.log(value, "selected")
}
</script>
<template>
  <div class="bg-base-3" style="display: inline-block; width: 200px">
    <HNavList :model="model" @on-select="onSelect"></HNavList>
  </div>
</template>
