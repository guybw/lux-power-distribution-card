import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EDITOR_NAME } from './const';
import { LuxCardConfig } from './config';
import { HomeAssistant, LovelaceCardEditor } from './lib/types';

@customElement(EDITOR_NAME)
export class LuxPowerDistributionCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: LuxCardConfig;

  public setConfig(config: LuxCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) return;
    const target = ev.target as HTMLInputElement;
    const configValue = target.configValue;
    let value: string | number | boolean | undefined = ev.detail?.value ?? target.value;

    if (target.type === 'number') {
      value = Number(value);
    }

    if (configValue) {
      const newConfig = { ...this._config };
      this._setNestedValue(newConfig, configValue, value);
      this._config = newConfig;
      this._fireConfigChanged();
    }
  }

  private _setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
  }

  private _entityChanged(ev: CustomEvent, configPath: string, index: number): void {
    if (!this._config || !this.hass) return;
    const value = ev.detail?.value;
    const newConfig = JSON.parse(JSON.stringify(this._config));
    
    const keys = configPath.split('.');
    let current: Record<string, unknown> = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    const arrayKey = keys[keys.length - 1];
    if (!Array.isArray(current[arrayKey])) {
      current[arrayKey] = [];
    }
    (current[arrayKey] as string[])[index] = value || '';
    
    this._config = newConfig;
    this._fireConfigChanged();
  }

  private _fireConfigChanged(): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _renderEntityPickers(label: string, configPath: string, entities: string[] | undefined, count: number): TemplateResult {
    const entityList = entities || [];
    return html`
      <div class="entity-group">
        <div class="entity-label">${label}</div>
        ${Array.from({ length: count }, (_, i) => html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${entityList[i] || ''}
            .label=${`Inverter ${i + 1}`}
            .configValue=${configPath}
            allow-custom-entity
            @value-changed=${(ev: CustomEvent) => this._entityChanged(ev, configPath, i)}
          ></ha-entity-picker>
        `)}
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const inverterCount = this._config.inverter_count || 1;
    const useFlowEntities = !this._config.battery?.charge_live_entities?.length;

    return html`
      <div class="card-config">
        <!-- Basic Settings -->
        <div class="section">
          <div class="section-header">Basic Settings</div>
          <ha-textfield
            label="Card Title (optional)"
            .value=${this._config.title || ''}
            .configValue=${'title'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Inverter Count"
            type="number"
            min="1"
            max="10"
            .value=${String(inverterCount)}
            .configValue=${'inverter_count'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <!-- Battery Configuration -->
        <div class="section">
          <div class="section-header">Battery Configuration</div>
          ${this._renderEntityPickers(
            'SOC Entities (required)',
            'battery.soc_entities',
            this._config.battery?.soc_entities,
            inverterCount
          )}
          
          <div class="flow-toggle">
            <ha-formfield label="Use separate charge/discharge entities">
              <ha-switch
                .checked=${!useFlowEntities}
                @change=${this._toggleBatteryFlowMode}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${useFlowEntities
            ? this._renderEntityPickers(
                'Flow Entities (required)',
                'battery.flow_entities',
                this._config.battery?.flow_entities,
                inverterCount
              )
            : html`
                ${this._renderEntityPickers(
                  'Charge Entities',
                  'battery.charge_live_entities',
                  this._config.battery?.charge_live_entities,
                  inverterCount
                )}
                ${this._renderEntityPickers(
                  'Discharge Entities',
                  'battery.discharge_live_entities',
                  this._config.battery?.discharge_live_entities,
                  inverterCount
                )}
              `
          }

          <ha-formfield label="Invert battery flow direction">
            <ha-switch
              .checked=${this._config.battery?.invert_flow || false}
              .configValue=${'battery.invert_flow'}
              @change=${this._boolChanged}
            ></ha-switch>
          </ha-formfield>
        </div>

        <!-- Grid Configuration -->
        <div class="section">
          <div class="section-header">Grid Configuration</div>
          ${this._renderEntityPickers(
            'Flow Entities (required)',
            'grid.flow_entities',
            this._config.grid?.flow_entities,
            inverterCount
          )}
          <ha-formfield label="Invert grid flow direction">
            <ha-switch
              .checked=${this._config.grid?.invert_flow || false}
              .configValue=${'grid.invert_flow'}
              @change=${this._boolChanged}
            ></ha-switch>
          </ha-formfield>
        </div>

        <!-- Consumption Configuration -->
        <div class="section">
          <div class="section-header">Consumption Configuration</div>
          ${this._renderEntityPickers(
            'Home Entities (required)',
            'consumption.home_entities',
            this._config.consumption?.home_entities,
            inverterCount
          )}
        </div>

        <!-- PV Configuration (Optional) -->
        <div class="section">
          <div class="section-header">Solar/PV Configuration (optional)</div>
          ${this._renderEntityPickers(
            'Combined PV Entities',
            'pv.combined_entities',
            this._config.pv?.combined_entities,
            inverterCount
          )}
        </div>
      </div>
    `;
  }

  private _toggleBatteryFlowMode(ev: Event): void {
    if (!this._config) return;
    const target = ev.target as HTMLInputElement;
    const useSeparate = target.checked;
    
    const newConfig = JSON.parse(JSON.stringify(this._config));
    if (!newConfig.battery) newConfig.battery = {};
    
    if (useSeparate) {
      delete newConfig.battery.flow_entities;
      newConfig.battery.charge_live_entities = newConfig.battery.charge_live_entities || [];
      newConfig.battery.discharge_live_entities = newConfig.battery.discharge_live_entities || [];
    } else {
      delete newConfig.battery.charge_live_entities;
      delete newConfig.battery.discharge_live_entities;
      newConfig.battery.flow_entities = newConfig.battery.flow_entities || [];
    }
    
    this._config = newConfig;
    this._fireConfigChanged();
  }

  private _boolChanged(ev: Event): void {
    if (!this._config) return;
    const target = ev.target as HTMLInputElement & { configValue: string };
    const configValue = target.configValue;
    const value = target.checked;

    if (configValue) {
      const newConfig = JSON.parse(JSON.stringify(this._config));
      this._setNestedValue(newConfig, configValue, value);
      this._config = newConfig;
      this._fireConfigChanged();
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        padding: 16px;
      }
      .section {
        margin-bottom: 24px;
        padding: 16px;
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        border: 1px solid var(--divider-color, #e0e0e0);
      }
      .section-header {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
        color: var(--primary-text-color);
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        padding-bottom: 8px;
      }
      .entity-group {
        margin-bottom: 16px;
      }
      .entity-label {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--secondary-text-color);
      }
      ha-entity-picker {
        display: block;
        margin-bottom: 8px;
      }
      ha-textfield {
        display: block;
        margin-bottom: 16px;
      }
      ha-formfield {
        display: block;
        margin: 8px 0;
      }
      .flow-toggle {
        margin: 16px 0;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 4px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [EDITOR_NAME]: LuxPowerDistributionCardEditor;
  }
}
