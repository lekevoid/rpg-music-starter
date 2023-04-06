import { ref, computed } from "vue";
import useSupabase from "boot/supabase";

// import { useRouter } from "vue-router";
// const router = useRouter();

const user = ref(null);

export default function useAuthUser() {
	const { supabase } = useSupabase();

	const login = async (email, password) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		console.log(email, password);
		console.log(data);

		if (error) {
			throw error;
		}

		return data;
	};

	const logout = async () => {
		const { data, error } = await supabase.auth.signOut();

		if (error) {
			throw error;
		}

		return data;
	};

	const isLoggedIn = computed(() => {
		return !!user.value;
	});

	return { user, login, logout, isLoggedIn };
}
