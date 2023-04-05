import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import useSupabase from "boot/supabase";

const project = process.env.GAME;

export const useCategoriesStore = defineStore("categories", () => {
	const categories = ref([]);
	const { supabase } = useSupabase();

	async function initCategoriesForProject() {
		const { data, error } = await supabase.from("categories").upsert({ name: "TBD", project: project, icon: "none" }).select();

		if (error) {
			throw error;
		}

		if (data) {
			categories.value = data;
		}
	}

	async function fetchCategories() {
		const { data, error } = await supabase.from("categories").select().eq("project", project);

		if (error) {
			throw error;
		}

		if (data.length === 0) {
			initCategoriesForProject();
		}

		categories.value = data;
	}

	onMounted(() => {
		if (categories.value.length === 0) {
			fetchCategories();
		}
	});

	return { categories, fetchCategories };
});
