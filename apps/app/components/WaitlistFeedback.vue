<script lang="ts" setup>
const props = defineProps({
    formFeedback: String,
});
</script>

<template>
    <div v-if="formFeedback === 'error'" class="feedback text-white w-full block p-3 mt-4 bg-red-500">
        Error processing request.
    </div>

    <div v-if="formFeedback === 'negligible'" class="feedback text-white w-full block p-3 mt-4 bg-orange-500">
        Email already exists.
    </div>

    <div v-else-if="formFeedback === 'success'" class="feedback text-white w-full block p-3 mt-4 bg-green-500">
        Registered Successfully! Don't Reload!!
    </div>

    <div v-else-if="formFeedback === 'incomplete'" class="feedback text-white w-full block p-3 mt-4 bg-red-500">
        Please complete the required field.
    </div>

    <div v-else-if="formFeedback === 'invalid'" class="feedback text-white w-full block p-3 mt-4 bg-red-500">
        Please enter a valid email address.
    </div>

    <div v-else-if="formFeedback === 'consent'" class="feedback text-white w-full block p-3 mt-4 bg-red-500">
        Please agree to terms and conditions.
    </div>
    
    <div v-else-if="formFeedback != null && formFeedback != ''" class="feedback text-white w-full block p-3 mt-4 bg-red-500">
        {{ formFeedback }}
    </div>
</template>

<style>
.feedback {
    @apply rounded;
}
</style>