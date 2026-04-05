import { createSignal, Show, onMount } from "solid-js"
import { Logo } from "@tui/component/logo"
import { useTheme } from "@tui/context/theme"
import { useRoute } from "@tui/context/route"
import { useSDK } from "@tui/context/sdk"
import { useSync } from "@tui/context/sync"
import { TextareaRenderable, TextAttributes } from "@opentui/core"
import { useKeyboard } from "@opentui/solid"
import { Link } from "@tui/ui/link"
import { Spinner } from "@tui/component/spinner"
import { Toast } from "@tui/ui/toast"
import { TuiPluginRuntime } from "../plugin"

type Step = "welcome" | "apikey" | "done"

export function Onboarding() {
  const [step, setStep] = createSignal<Step>("welcome")

  return (
    <>
      <box flexGrow={1} alignItems="center" paddingLeft={2} paddingRight={2}>
        <box flexGrow={1} minHeight={0} />
        <box height={4} minHeight={0} flexShrink={1} />
        <box flexShrink={0}>
          <Logo />
        </box>
        <box height={1} minHeight={0} flexShrink={1} />
        <box width="100%" maxWidth={75} paddingTop={1} flexShrink={0}>
          <Show when={step() === "welcome"}>
            <WelcomeStep onContinue={() => setStep("apikey")} />
          </Show>
          <Show when={step() === "apikey"}>
            <ApiKeyStep onSuccess={() => setStep("done")} onBack={() => setStep("welcome")} />
          </Show>
          <Show when={step() === "done"}>
            <DoneStep />
          </Show>
        </box>
        <box flexGrow={1} minHeight={0} />
        <Toast />
      </box>
      <box width="100%" flexShrink={0}>
        <TuiPluginRuntime.Slot name="home_footer" mode="single_winner" />
      </box>
    </>
  )
}

function WelcomeStep(props: { onContinue: () => void }) {
  const { theme } = useTheme()

  useKeyboard((evt) => {
    if (evt.name === "return") {
      props.onContinue()
      evt.preventDefault()
    }
  })

  return (
    <box gap={1}>
      <box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
        <text attributes={TextAttributes.BOLD} fg={theme.text}>
          Welcome to Awareness
        </text>
        <text fg={theme.textMuted}>1 of 2</text>
      </box>
      <box gap={1} paddingTop={1}>
        <text fg={theme.textMuted}>
          Your intelligent development companion. Let's connect your AI provider to get started.
        </text>
      </box>
      <box paddingTop={1}>
        <text fg={theme.text}>
          enter <span style={{ fg: theme.textMuted }}>get started</span>
        </text>
      </box>
    </box>
  )
}

function ApiKeyStep(props: { onSuccess: () => void; onBack: () => void }) {
  const { theme } = useTheme()
  const sdk = useSDK()
  const sync = useSync()
  const [busy, setBusy] = createSignal(false)
  const [error, setError] = createSignal<string | undefined>()
  let textarea: TextareaRenderable

  useKeyboard((evt) => {
    if (busy()) {
      evt.preventDefault()
      evt.stopPropagation()
      return
    }
    if (evt.name === "escape") {
      props.onBack()
      evt.preventDefault()
    }
  })

  onMount(() => {
    setTimeout(() => {
      if (!textarea || textarea.isDestroyed) return
      textarea.focus()
    }, 1)
  })

  async function submit(value: string) {
    const key = value.trim()
    if (!key) return
    setBusy(true)
    setError(undefined)
    try {
      await sdk.client.auth.set({
        providerID: "openrouter",
        auth: { type: "api", key },
      })
      await sdk.client.instance.dispose()
      await sync.bootstrap()
      props.onSuccess()
    } catch {
      setBusy(false)
      setError("Failed to save key. Please try again.")
    }
  }

  return (
    <box gap={1}>
      <box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
        <text attributes={TextAttributes.BOLD} fg={theme.text}>
          Connect OpenRouter
        </text>
        <text fg={theme.textMuted}>2 of 2</text>
      </box>
      <box gap={1} paddingTop={1}>
        <text fg={theme.textMuted}>
          Awareness uses OpenRouter to access AI models. Paste your API key below.
        </text>
        <Link href="https://openrouter.ai/keys" fg={theme.primary}>
          Get a free key at openrouter.ai/keys
        </Link>
      </box>
      <textarea
        onSubmit={() => {
          if (busy()) return
          submit(textarea.plainText)
        }}
        height={3}
        keyBindings={busy() ? [] : [{ name: "return", action: "submit" }]}
        ref={(val: TextareaRenderable) => {
          textarea = val
        }}
        placeholder="sk-or-..."
        placeholderColor={theme.textMuted}
        textColor={busy() ? theme.textMuted : theme.text}
        focusedTextColor={busy() ? theme.textMuted : theme.text}
        cursorColor={busy() ? theme.backgroundElement : theme.text}
      />
      <Show when={error()}>
        <text fg={theme.error}>{error()}</text>
      </Show>
      <box paddingBottom={1} gap={1} flexDirection="row">
        <Show
          when={!busy()}
          fallback={<Spinner color={theme.textMuted}>Connecting...</Spinner>}
        >
          <text fg={theme.text}>
            enter <span style={{ fg: theme.textMuted }}>connect</span>
          </text>
          <text fg={theme.textMuted}>  </text>
          <text fg={theme.text}>
            esc <span style={{ fg: theme.textMuted }}>back</span>
          </text>
        </Show>
      </box>
    </box>
  )
}

function DoneStep() {
  const { theme } = useTheme()
  const route = useRoute()

  useKeyboard((evt) => {
    if (evt.name === "return") {
      route.navigate({ type: "home" })
      evt.preventDefault()
    }
  })

  return (
    <box gap={1}>
      <text attributes={TextAttributes.BOLD} fg={theme.success}>
        You're all set!
      </text>
      <box gap={1} paddingTop={1}>
        <text fg={theme.textMuted}>
          OpenRouter is connected. Awareness is ready.
        </text>
      </box>
      <box paddingTop={1}>
        <text fg={theme.text}>
          enter <span style={{ fg: theme.textMuted }}>start using awareness</span>
        </text>
      </box>
    </box>
  )
}
