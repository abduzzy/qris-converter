<script setup lang="ts"></script>

<template>
  <div class="max-w-[80ch] w-full mx-auto flex flex-col gap-y-8 px-6 py-8">
    <slot />

    <UFooter>
      <template #left>
        <p class="text-sm">
          Made with <strong class="text-highlighted">Nuxt</strong>
        </p>
        <UIcon name="vscode-icons:file-type-nuxt" size="24" />
      </template>
      <template #right>
        <UButton
          to="https://github.com/abduzzy/qris-converter"
          :external="true"
          square
          icon="tabler:brand-github"
          color="neutral"
          variant="soft"
        />
      </template>
    </UFooter>
  </div>
</template>
