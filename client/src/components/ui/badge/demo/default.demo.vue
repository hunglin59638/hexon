<script setup lang="ts">
import { HBadge } from "../"
import { HIcon, HIconName } from "@/ui/icon"
import { useThemeVars } from "../../theme"
const vars = useThemeVars()
</script>
<template>
  <h2>Basic</h2>

  <HBadge>1</HBadge>
  <HBadge>2</HBadge>
  <HBadge>3</HBadge>
  <HBadge>HBadge</HBadge>
  <HBadge>HBadge</HBadge>
  <HBadge>HBadge</HBadge>

  <h2>Clicked</h2>

  <HBadge clickable>HBadge</HBadge>
  <HBadge clickable>HBadge</HBadge>
  <HBadge clickable>HBadge</HBadge>

  <h2>With Icon</h2>

  <HBadge clickable>
    <HIcon :name="HIconName.Search" />
    Search
  </HBadge>
  <HBadge clickable>
    <HIcon :name="HIconName.Add" />
    Add
  </HBadge>
  <HBadge clickable>
    <HIcon :name="HIconName.Edit" />
    Edit
  </HBadge>
  <HBadge clickable>
    <HIcon :name="HIconName.Tag" />
    Tag
  </HBadge>

  <HBadge clickable><HIcon :name="HIconName.Search" /></HBadge>
  <HBadge clickable><HIcon :name="HIconName.Add" /></HBadge>
  <HBadge clickable><HIcon :name="HIconName.Edit" /></HBadge>
  <HBadge clickable><HIcon :name="HIconName.Tag" /></HBadge>

  <h2>Different color</h2>

  <HBadge :bgColor="vars.colorError" clickable>
    <HIcon :name="HIconName.Delete" />
    Delete
  </HBadge>
  <HBadge :bgColor="vars.colorWarning" clickable>
    <HIcon :name="HIconName.Warning" />
    Warning
  </HBadge>
  <HBadge :bgColor="vars.colorSuccess" clickable>
    <HIcon :name="HIconName.Accept" />
    Accept
  </HBadge>

  <h2>Round</h2>

  <HBadge rounded>1</HBadge>
  <HBadge rounded>2</HBadge>
  <HBadge rounded>3</HBadge>
  <HBadge rounded>HBadge</HBadge>
  <HBadge rounded clickable><HIcon :name="HIconName.Search" /></HBadge>
</template>
<style>
.h-badge {
  @apply mr-1;
}
</style>
