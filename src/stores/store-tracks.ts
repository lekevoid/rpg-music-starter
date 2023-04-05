import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import useSupabase from "boot/supabase";

const project = process.env.GAME;

export const useTracksStore = defineStore("counter", () => {
	const tracks = ref([]);
	const { supabase } = useSupabase();

	const fetchTracks = async () => {
		const { data, error } = await supabase.from("tracks").select().eq("project", project);

		console.log(data);

		if (error) {
			throw error;
		}

		tracks.value = data;
	};

	onMounted(() => {
		console.log("mount tracks", tracks.value);
		if (tracks.value.length === 0) {
			fetchTracks();
		}
	});

	return { tracks, fetchTracks };
});
