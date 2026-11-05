#!/usr/bin/env python3
"""Regression of Android UIAutomator control bounds at the fixed mobile tab bar.

A real Make Lab failure showed Decision at [522,1909][726,2033],
while Mobile navigation began at y=2028. The upper 64 pixels are safe;
the whole-button-bounds rejection was incorrectly refusing that control.
"""
import ast
from pathlib import Path

script = Path(__file__).resolve().parents[1] / "scripts/android-emulator-learning-state.py"
source = script.read_text(encoding="utf-8")
tree = ast.parse(source, filename=str(script))
fn = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == "visible_control_bounds")
module = ast.Module(body=[fn], type_ignores=[])
ns = {"TOP": 145}
exec(compile(module, str(script), "exec"), ns)
clip = ns["visible_control_bounds"]

bottom = 2028 - 55
decision = clip((522,1909,726,2033), bottom)
assert decision == (522,1909,726,1973), decision
assert (decision[1]+decision[3])//2 == 1941, "Click inside the visible control, above navigation"
assert clip((500,2050,740,2180), bottom) is None, "Never click under the mobile bar"
assert clip((0,0,0,0), bottom) is None, "Never click empty WebView virtual nodes"
assert clip((500,1940,740,1990), bottom) is None, "Too little of control visible to tap safely"
assert clip((500,300,740,400), bottom) == (500,300,740,400), "Keep fully visible controls unchanged"
assert clip((500,100,740,180), bottom) is None, "Respect top safe inset with insufficient visible space"
print("PASS: visible control clipping taps a real, safe part of the Make Lab button above mobile navigation.")
