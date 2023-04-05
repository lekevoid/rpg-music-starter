import { ref, computed, onMounted } from "vue";
import useSupabase from "boot/supabase";

const project = process.env.GAME;
// import { useRouter } from "vue-router";
// const router = useRouter();

const tracks = ref([]);

export default function useAuthUser() {
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
}
