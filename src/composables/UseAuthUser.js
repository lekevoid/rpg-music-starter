import { ref, computed } from "vue";
import useSupabase from "boot/supabase";

import { useRouter } from "vue-router";
// const router = useRouter();

const user = ref(null);

export default function useAuthUser() {
	const { supabase } = useSupabase();

	const login = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: "example@email.com",
			password: "example-password",
		});

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
