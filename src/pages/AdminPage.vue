<template>
	<q-page class="q-pa-lg">
		<h1 class="text-h4">Admin Dashboard</h1>
		<div>
			<q-table
				flat
				bordered
				hide-bottom
				hide-pagination
				title="Tracks"
				:rows="tableData"
				:columns="tableColumns"
				row-key="file"
				binary-state-sort
				:pagination="tablePagination"
				v-model:selected="selectedTracks"
			>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="selected" :props="props" class="items-center">
							<q-checkbox v-model="props.row.selected" />
						</q-td>
						<q-td key="filename" :props="props" class="items-center">
							{{ props.row.filename }}
						</q-td>
						<q-td key="label" :props="props" class="items-center">
							<div v-if="props.row.inDB">
								{{ props.row.label }}
								<q-popup-edit v-model="props.row.label" title="Edit the Name" auto-save v-slot="scope">
									<q-input
										v-model="scope.value"
										dense
										autofocus
										counter
										@keyup.enter="scope.set"
										@change="updateTrackField(props.row.id, 'label', scope.value)"
									/>
								</q-popup-edit>
							</div>
						</q-td>
						<q-td key="category" :props="props" class="items-center">
							{{ props.row.category }}
						</q-td>
						<q-td key="subcategory" :props="props" class="items-center">
							{{ props.row.subcategory }}
						</q-td>
						<q-td key="intensity" :props="props" class="items-center">
							{{ props.row.intensity }}
						</q-td>
						<q-td key="inDB" :props="props" class="items-center">
							<span v-if="props.row.inDB">✅</span>
							<q-btn v-else color="purple" glossy label="Register" size="xs" @click="registerTrack({ filename: props.row.filename })" />
						</q-td>
					</q-tr>
				</template>
			</q-table>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCategoriesStore } from "src/stores/store-categories";
import { useTracksStore } from "src/stores/store-tracks";

const { categories } = storeToRefs(useCategoriesStore());
const { tracks } = storeToRefs(useTracksStore());
const { addTrackToDB } = useTracksStore();

const _filesystemTracks = import.meta.glob("/public/music/*", { eager: true }) || [];

const selectedTracks = ref([]);

function registerTrack(track /* , fetchAfterRegistering = true */) {
	// console.log(filename, fetchAfterRegistering);
	addTrackToDB(track);
}

function updateTrackField(trackID, fieldName, newValue) {
	console.log(trackID, fieldName, newValue);
}

/* function registerTracks(trackList) {
	console.log(trackList);
} */

const filesystemTracks = computed(() => {
	let out = Object.values(_filesystemTracks)
		.map((track) => {
			const filename = track.name.match(/[^/]+\.mp3$/)?.[0];

			if (filename) {
				return { filename: filename.replace(".mp3", "") };
			}

			return null;
		})
		.filter(Boolean);

	return out;
});

const allTracks = computed(() => {
	let out = tracks.value.map((t) => ({ ...t, inDB: true, selected: false }));

	filesystemTracks.value.forEach((t) => {
		const existingTrack = out.find((x) => x.filename === t.filename);
		if (!existingTrack) {
			out.push({ ...t, inDB: false, selected: false });
		}
	});

	return out;
});

const tablePagination = {
	sortBy: "filename",
	descending: false,
	page: 1,
	rowsPerPage: 0,
};

const tableColumns = [
	{ name: "selected", required: false, label: "", align: "center", field: (row) => row.selected, format: (val) => `${val}`, sortable: true },
	{ name: "filename", required: true, label: "File name", align: "left", field: (row) => row.filename, format: (val) => `${val}`, sortable: true },
	{ name: "label", required: false, label: "Label", align: "left", field: (row) => row.label, format: (val) => `${val}`, sortable: true },
	{ name: "category", required: false, label: "Category", align: "left", field: (row) => row.category, format: (val) => `${val}`, sortable: true },
	{ name: "subcategory", required: false, label: "Subcategory", align: "left", field: (row) => row.subcategory, format: (val) => `${val}`, sortable: true },
	{ name: "intensity", required: false, label: "Intensity", align: "center", field: (row) => row.intensity, format: (val) => `${val}`, sortable: true },
	{ name: "inDB", required: false, label: "In DB", align: "left", field: (row) => row.inDB, format: (val) => `${val}`, sortable: true },
];

const tableData = ref(allTracks.value);

watch(allTracks, (newVal) => {
	tableData.value = newVal;
});
</script>
