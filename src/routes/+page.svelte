<script lang="ts" context="module">
  const rpcUrl = "/alchemy-rpc";

  const config = createConfig({
    rpcUrl,
    chain: polygonAmoy,
    ssr: true,
    storage: cookieStorage,
  });
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import {
    cookieStorage,
    cookieToInitialState,
    createAccount,
    createConfig,
    getAccount,
    getSigner,
    hydrate,
    watchAccount,
    watchSignerStatus
  } from "@alchemy/aa-alchemy/config";

  import { polygonAmoy } from "@alchemy/aa-core";

  import type { MouseEventHandler } from "svelte/elements";
  import type { PageData } from "./$types";

  export let data: PageData;

  const initialState = cookieToInitialState(config, data.cookie ?? undefined);
  const { onMount: hydrateOnMount } = hydrate(config, initialState);

  const logInUsingPasskey: (
    type: "login" | "signup"
  ) => MouseEventHandler<HTMLButtonElement> =
    (type: "login" | "signup") => async () => {
      const signer = getSigner(config);
      if (!signer) throw "No signer";

      if (type === "login") {
        await signer.authenticate({
          type: "passkey",
          createNew: false,
        });
      } else {
        await signer.authenticate({
          type: "passkey",
          createNew: true,
          username: "svelte test",
        });
      }
    };
  
    const disconnect = async () => {
      const signer = getSigner(config);
      await signer?.disconnect();
    };

  onMount(async () => {
    console.log("onmount", await hydrateOnMount());

    // we should only create the account once the signer is confirmed to be connected
    watchSignerStatus(config)(async (status) => {
      console.log(status);
      const account = getAccount({ type: "MultiOwnerModularAccount" }, config);
      if (status.isConnected && (!account || account.status === "DISCONNECTED")) {
        // this creates an account the first time the signer is connected and the account is not already created
        console.log("creating account", 
          await createAccount({ type: "MultiOwnerModularAccount" }, config)
        );
      }
    });

    watchAccount("MultiOwnerModularAccount", config)(account => {
      // here you would set the account variable if you need it in your UI
      console.log("got account", account);
    });
  });
</script>

<button on:click={logInUsingPasskey("signup")}>Sign Up</button>
<button on:click={logInUsingPasskey("login")}>Log In</button>
<button on:click={disconnect}>Disconnect</button>

<pre>
<!-- {JSON.stringify(getAccount({ type: "MultiOwnerModularAccount" }, config))} -->
</pre>

<pre>
<!-- {JSON.stringify(getSigner(config))} -->
</pre>

<div id="alchemy-iframe-container"></div>
