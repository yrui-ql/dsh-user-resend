window.__ModuleLoader__.load({
  id: 'dsh-user-resend',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Locale namespace owned by this package. */
    const NS = 'dsh-user-resend'
    /** Class prefix for the replaced user row. */
    const P = 'dsurbs_'

    const STYLE_ID = 'dsh-user-resend/styles'

    const CSS = `
.${P}row{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
.${P}actions{height:calc(28px + var(--dsh-content-font-delta,0px));display:flex;align-items:center;gap:8px}
.${P}time{font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(24px + var(--dsh-content-font-delta,0px));color:var(--dsw-alias-label-secondary);white-space:nowrap;padding-right:12px}
.${P}action{width:calc(28px + var(--dsh-content-font-delta,0px));height:calc(28px + var(--dsh-content-font-delta,0px));padding:6px;border:0;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.${P}action:hover{background:var(--dsw-alias-bg-layer-2)}
.${P}action:disabled{cursor:default;opacity:.55}
.${P}action:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.${P}action svg{display:block;width:calc(15px + var(--dsh-content-font-delta,0px));height:calc(15px + var(--dsh-content-font-delta,0px))}
.${P}action[data-state="sending"] svg{animation:dsurbsSpin 1s linear infinite}
.${P}action[data-state="sent"]{color:var(--dsw-alias-state-success-primary)}
.${P}action[data-state="failed"]{color:var(--dsw-alias-state-error-primary)}
@keyframes dsurbsSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){.${P}action[data-state="sending"] svg{animation:none}}
@media (hover:hover){
  [data-chat-flow-kind="user"]:has(~ [data-chat-flow-kind="user"]) .${P}actions{opacity:0;transition:opacity 80ms}
  [data-chat-flow-kind="user"]:has(~ [data-chat-flow-kind="user"]):hover .${P}actions,
  [data-chat-flow-kind="user"]:has(~ [data-chat-flow-kind="user"]):focus-within .${P}actions{opacity:1}
}
.${P}fallbackBubble{max-width:100%;padding:10px 16px;border-radius:12px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:var(--dsh-content-font-size,14px);line-height:calc(22px + var(--dsh-content-font-delta,0px));white-space:pre-wrap;word-break:break-word}
`

    const ZH = {
      'resend': '重新发送',
      'resendSending': '正在重新发送…',
      'resendSent': '已重新发送',
      'resendFailed': '重新发送失败',
      'resendBusy': '回合进行中，等它结束再重发',
      'copy': '复制',
      'copied': '已复制',
      'clock.md': '{m}月{d}日',
      'clock.ymd': '{y}年{m}月{d}日',
    }

    const EN = {
      'resend': 'Resend message',
      'resendSending': 'Resending…',
      'resendSent': 'Message resent',
      'resendFailed': 'Resend failed',
      'resendBusy': 'A turn is running; resend after it ends',
      'copy': 'Copy',
      'copied': 'Copied',
      'clock.md': '{m}/{d}',
      'clock.ymd': '{y}-{m}-{d}',
    }

    function iconCopy() {
      return h('svg', {
        viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor',
        'stroke-width': '1.3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'aria-hidden': 'true', focusable: 'false',
      }, [
        h('rect', { key: 'front', x: '5.5', y: '5.5', width: '7', height: '7', rx: '1.5' }),
        h('path', { key: 'back', d: 'M10.5 4.5v-.9a1.1 1.1 0 0 0-1.1-1.1H4.1A1.1 1.1 0 0 0 3 3.6v5.3a1.1 1.1 0 0 0 1.1 1.1h.9' }),
      ])
    }

    function iconCheck() {
      return h('svg', {
        viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor',
        'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'aria-hidden': 'true', focusable: 'false',
      }, h('path', { d: 'M3.2 8.4l3.1 3.1 6.5-6.9' }))
    }

    function iconResend() {
      return h('svg', {
        viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor',
        'stroke-width': '1.3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'aria-hidden': 'true', focusable: 'false',
      }, [
        h('path', { key: 'arc', d: 'M13.3 9.4A5.6 5.6 0 1 1 11.8 3.9' }),
        h('path', { key: 'head', d: 'M13.6 2.3v3.2h-3.2' }),
      ])
    }

    function iconWarning() {
      return h('svg', {
        viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor',
        'stroke-width': '1.3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'aria-hidden': 'true', focusable: 'false',
      }, [
        h('path', { key: 'tri', d: 'M8 2.4l5.1 9.1a1 1 0 0 1-.9 1.5H3.8a1 1 0 0 1-.9-1.5z' }),
        h('path', { key: 'bar', d: 'M8 6.2v2.6' }),
        h('path', { key: 'dot', d: 'M8 11.1v.1' }),
      ])
    }

    function pad2(n) {
      return String(n).padStart(2, '0')
    }

    function interpolate(template, params) {
      return String(template).replace(/\{(\w+)\}/g, function (match, key) {
        return params[key] === undefined ? match : String(params[key])
      })
    }

    /** Same compact timestamp contract as the shipped user row. */
    function formatClock(time, t) {
      if (typeof time !== 'number') return ''
      const date = new Date(time)
      const now = new Date()
      const clock = pad2(date.getHours()) + ':' + pad2(date.getMinutes())
      if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) return clock
      const params = { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() }
      if (date.getFullYear() === now.getFullYear()) return interpolate(t('clock.md', params), params) + ' ' + clock
      return interpolate(t('clock.ymd', params), params) + ' ' + clock
    }

    /** Split one user message's content exactly like the shipped row does. */
    function contentParts(content) {
      const texts = []
      const attachments = []
      const rest = []
      for (const block of content) {
        if (block === null || typeof block !== 'object') {
          rest.push(block)
        } else if (block.type === 'text' && typeof block.text === 'string') {
          texts.push(block.text)
        } else if (block.type === 'image' && block.attachment !== undefined) {
          attachments.push({ type: 'image', image: { attachment: block.attachment } })
        } else if (block.type === 'file' && block.attachment !== undefined) {
          attachments.push({ type: 'file', file: block.attachment })
        } else {
          rest.push(block)
        }
      }
      return { text: texts.join(''), attachments, rest }
    }

    async function copyText(text) {
      try {
        if (navigator.clipboard !== undefined && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(text)
          return true
        }
      } catch (error) {
        // Fall through to the legacy path.
      }
      try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return ok
      } catch (error) {
        return false
      }
    }

    /** Convert attachment bytes to the canonical base64 the prompt wire expects. */
    function bytesToBase64(bytes) {
      let binary = ''
      const chunk = 0x8000
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
      }
      return btoa(binary)
    }

    /** True when the message has a text part or a durable image the resend can reproduce. */
    function hasResendable(blocks) {
      for (const block of blocks) {
        if (block === null || typeof block !== 'object') continue
        if (block.type === 'text' && typeof block.text === 'string' && block.text.trim() !== '') return true
        if (block.type === 'image' && block.attachment !== undefined && typeof block.attachment.attachmentId === 'string') return true
      }
      return false
    }

    /**
     * Rebuild the prompt content from the durable message blocks: text stays
     * text, and every durable image is read back through the Session's
     * attachment reader and re-encoded as a prompt image part. @file mentions
     * are ordinary prompt text, so they travel with the text parts.
     */
    async function buildPromptContent(session, blocks) {
      const content = []
      const texts = []
      const echoAttachments = []
      const objectUrls = []
      let hasText = false
      let hasImage = false
      for (const block of blocks) {
        if (block === null || typeof block !== 'object') continue
        if (block.type === 'text' && typeof block.text === 'string') {
          content.push({ type: 'text', text: block.text })
          texts.push(block.text)
          if (block.text.trim() !== '') hasText = true
          continue
        }
        if (block.type === 'image' && block.attachment !== undefined && typeof block.attachment.attachmentId === 'string') {
          const result = await session.readAttachment(block.attachment.attachmentId)
          if (result === undefined || result === null || result.ok !== true) throw new Error('dsh-user-resend: image read failed')
          if (result.value === undefined || result.value === null || result.value.data === undefined) throw new Error('dsh-user-resend: image bytes missing')
          const ref = result.value.attachment !== undefined && result.value.attachment !== null ? result.value.attachment : {}
          const mediaType = typeof ref.mediaType === 'string' ? ref.mediaType : typeof block.attachment.mediaType === 'string' ? block.attachment.mediaType : 'image/png'
          const bytes = result.value.data
          const part = { type: 'image', mediaType, data: bytesToBase64(bytes) }
          const name = typeof ref.name === 'string' ? ref.name : typeof block.attachment.name === 'string' ? block.attachment.name : undefined
          if (name !== undefined && name !== '') part.name = name
          content.push(part)
          hasImage = true
          // The submission echo the Host renders needs a preview URL, not the bytes;
          // the prompt part keeps the bytes. A failed preview only degrades the echo.
          try {
            const previewUrl = URL.createObjectURL(new Blob([bytes], { type: mediaType }))
            objectUrls.push(previewUrl)
            echoAttachments.push({
              type: 'image',
              value: {
                previewUrl,
                ...name === undefined || name === '' ? {} : { name },
                ...typeof block.attachment.width === 'number' ? { width: block.attachment.width } : {},
                ...typeof block.attachment.height === 'number' ? { height: block.attachment.height } : {},
              },
            })
          } catch (error) {}
        }
        // Generic file blocks have no prompt-side receipt in the durable log,
        // so they cannot be re-sent yet; text and images still travel.
      }
      if (!hasText && !hasImage) throw new Error('dsh-user-resend: nothing to resend')
      return { content, text: texts.join('\n'), echoAttachments, objectUrls }
    }

    /** Release the object URLs minted for a submission echo; safe to call twice. */
    function revokeObjectUrls(urls) {
      for (const url of urls) {
        try {
          URL.revokeObjectURL(url)
        } catch (error) {}
      }
    }

    function fallbackTranslate(key) {
      return key
    }

    /**
     * Replacement renderer for the Chat `user` node kind. It keeps the shipped
     * content factory (bubble, images, references) and adds the resend action
     * beside the time and copy controls.
     */
    function UserMessageRow(props) {
      const node = props.node
      const data = node.data
      const sessionId = props.sessionId
      const sessions = props.sessions
      const renderFactorySlot = props.renderFactorySlot
      const loadImage = props.loadImage
      const t = typeof props.t === 'function' ? props.t : fallbackTranslate

      const parts = React.useMemo(function () {
        return contentParts(Array.isArray(data.content) ? data.content : [])
      }, [data.content])

      const blocks = React.useMemo(function () {
        return Array.isArray(data.content) ? data.content : []
      }, [data.content])

      const prepared = React.useMemo(function () {
        const content = { text: parts.text, attachments: parts.attachments, extraBlocks: parts.rest }
        if (data.referenceLabels !== undefined) content.referenceLabels = data.referenceLabels
        return content
      }, [parts, data.referenceLabels])

      const facts = React.useMemo(function () {
        const next = {}
        if (data.referenceLabels !== undefined) next.sessionLabels = data.referenceLabels
        if (data.skillNames !== undefined) next.skillNames = data.skillNames
        return next
      }, [data.referenceLabels, data.skillNames])

      const [copyState, setCopyState] = React.useState('idle')
      const [resendState, setResendState] = React.useState('idle')
      const timers = React.useRef(null)
      if (timers.current === null) timers.current = new Set()
      React.useEffect(function () {
        return function () {
          for (const id of timers.current) clearTimeout(id)
          timers.current.clear()
        }
      }, [])

      function later(fn, ms) {
        const id = setTimeout(function () {
          timers.current.delete(id)
          fn()
        }, ms)
        timers.current.add(id)
      }

      function onCopy() {
        if (copyState !== 'idle') return
        copyText(parts.text).then(function (ok) {
          if (!ok) return
          setCopyState('copied')
          later(function () { setCopyState('idle') }, 1000)
        })
      }

      async function onResend() {
        if (resendState !== 'idle') return
        if (!hasResendable(blocks)) return
        const service = sessions
        if (service === undefined || service === null || typeof sessionId !== 'string' || typeof service.binding !== 'function') {
          setResendState('failed')
          later(function () { setResendState('idle') }, 2500)
          return
        }
        const binding = service.binding(sessionId)
        const session = binding === undefined ? undefined : binding.session
        if (session === undefined || typeof session.prompt !== 'function' || typeof session.readAttachment !== 'function') {
          setResendState('failed')
          later(function () { setResendState('idle') }, 2500)
          return
        }
        // A running turn accepts host-side queued input without a transcript entry: the
        // queued copy can be merged with a neighbour or dropped outright, which is how a
        // resend ends up carrying another (older) message's content. After the interruption
        // this action exists for, the agent is idle, so refuse while it runs instead.
        if (session.running === true) {
          setResendState('busy')
          later(function () { setResendState('idle') }, 2500)
          return
        }
        setResendState('sending')
        let built
        let submission
        try {
          built = await buildPromptContent(session, blocks)
          // Keep one line of evidence in the console: if a future report says "the resent
          // message is the wrong one", this line says exactly what this click built.
          try {
            console.debug('[dsh-user-resend] resend', built.content.map(function (part) { return part.type }).join('+'), JSON.stringify(built.text.slice(0, 120)))
          } catch (error) {}
          // Register the submission exactly like the shipped composer does: the echo makes
          // the pending message visible, and the requestId lets a failed prompt retire it
          // instead of leaving an orphaned queued copy behind.
          if (typeof session.beginSubmission === 'function') {
            try {
              submission = session.beginSubmission({
                mode: 'queue',
                text: built.text,
                attachments: built.echoAttachments,
              })
            } catch (error) {
              submission = undefined
            }
          }
          const requestId = submission === undefined ? undefined : submission.requestId
          const result = await session.prompt(built.content, 'queue', undefined, requestId)
          if (result !== undefined && result !== null && result.ok === true) {
            setResendState('sent')
            later(function () { setResendState('idle') }, 1500)
            later(function () { revokeObjectUrls(built.objectUrls) }, 30000)
            return
          }
          if (submission !== undefined && typeof submission.abandon === 'function') {
            try { submission.abandon() } catch (error) {}
          }
          setResendState('failed')
          later(function () { setResendState('idle') }, 2500)
          revokeObjectUrls(built.objectUrls)
        } catch (error) {
          if (submission !== undefined && typeof submission.abandon === 'function') {
            try { submission.abandon() } catch (nested) {}
          }
          setResendState('failed')
          later(function () { setResendState('idle') }, 2500)
          if (built !== undefined) revokeObjectUrls(built.objectUrls)
        }
      }

      const resendTitle = resendState === 'sending'
        ? t('resendSending')
        : resendState === 'sent'
          ? t('resendSent')
          : resendState === 'failed'
            ? t('resendFailed')
            : resendState === 'busy'
              ? t('resendBusy')
              : t('resend')
      const copyTitle = copyState === 'copied' ? t('copied') : t('copy')

      let content
      if (typeof renderFactorySlot === 'function') {
        content = renderFactorySlot('conversation.chat.user.content', {
          content: prepared,
          loadImage: loadImage,
          facts: facts,
          interactive: true,
        })
      } else {
        content = h('div', { className: P + 'fallbackBubble' }, prepared.text)
      }

      const actions = [
        h('span', { key: 'time', className: P + 'time' }, formatClock(data.time, t)),
        h('button', {
          key: 'copy',
          type: 'button',
          className: P + 'action',
          title: copyTitle,
          'aria-label': copyTitle,
          onClick: onCopy,
        }, copyState === 'copied' ? iconCheck() : iconCopy()),
      ]
      if (hasResendable(blocks)) {
        actions.push(h('button', {
          key: 'resend',
          type: 'button',
          className: P + 'action',
          'data-dsh-resend': '',
          'data-state': resendState,
          title: resendTitle,
          'aria-label': resendTitle,
          disabled: resendState === 'sending',
          onClick: onResend,
        }, resendState === 'sent' ? iconCheck() : resendState === 'failed' ? iconWarning() : iconResend()))
      }

      return h('div', { className: P + 'row', 'data-dsh-resend-row': '' },
        content,
        h('div', {
          className: P + 'actions',
          'data-dsh-resend-actions': '',
          'data-clock': 'start',
        }, actions),
      )
    }

    function apply(ctx) {
      const sessions = ctx.sessions

      ctx.effect(function () {
        return ctx.locale.register(NS, { zh: ZH, en: EN })
      }, 'dsh-user-resend: dictionaries')

      ctx.effect(function () {
        const tag = document.createElement('style')
        tag.dataset.plugin = 'dsh-user-resend'
        tag.dataset.pluginCss = STYLE_ID
        tag.textContent = CSS
        document.head.appendChild(tag)
        return function () { tag.remove() }
      }, 'dsh-user-resend: styles')

      ctx.slots.inject('conversation.chat.node', function () {
        return ctx.slots.register({
          name: 'conversation.chat.node',
          key: 'user',
          priority: -1,
          locale: NS,
          inject: function () {
            return { sessions }
          },
        }, UserMessageRow)
      })
    }

    return {
      inject: ['slots', 'sessions', 'locale'],
      apply,
    }
  },
})
