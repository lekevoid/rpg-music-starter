import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import useSupabase from "boot/supabase";

const project = process.env.GAME;

export const useTracksStore = defineStore("tracks", () => {
	const { supabase } = useSupabase();
	const tracks = ref([]);

	function prepareTrackForInsert(track) {
		if (!track.label) {
			track.label = track.filename;
		}

		if (!track.category) {
			track.category = "TBD";
		}

		if (!track.subcategory) {
			track.subcategory = "TBD";
		}

		track.project = project;

		console.log(track);

		return track;
	}

	function prepareTrackForUpdate(track) {
		track.project = project;
		return track;
	}

	async function fetchTracks() {
		const { data, error } = await supabase.from("tracks").select().eq("project", project);

		if (error) {
			throw error;
		}

		console.log(data);
		tracks.value = data;
		console.log(tracks.value);
	}

	async function addTrackToDB(track) {
		const existingTrack = tracks.value.find((t) => t.filename === track.filename);
		if (existingTrack) {
			updateTrackToDB(track);
			return;
		}

		const trackData = prepareTrackForInsert(track);
		const { data, error } = await supabase.from("tracks").insert(trackData).select();

		if (error) {
			throw error;
		}

		if (data) {
			console.log(data);
			tracks.value.push(data);
		}
	}

	async function updateTrackToDB(track) {
		const trackData = prepareTrackForUpdate(track);
		const { data, error } = await supabase.from("tracks").update(trackData).eq("project", project).eq("filename", trackData.filename).select();
		if (error) {
			throw error;
		}

		if (data) {
			tracks.value = tracks.value.map((t) => {
				if (t.project === trackData.project && t.filename === trackData.filename) {
					return { ...t, ...data[0] };
				}
				return t;
			});
		}

		console.log(tracks.value);
	}

	onMounted(() => {
		if (tracks.value.length === 0) {
			fetchTracks();
		}
	});

	return { tracks, addTrackToDB, fetchTracks };
});
